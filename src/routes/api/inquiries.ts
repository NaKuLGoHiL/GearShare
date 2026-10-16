import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { inquirySchema } from "@/lib/inquiry";

export const Route = createFileRoute("/api/inquiries")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { ok: false, error: "Invalid JSON request body" },
            { status: 400 }
          );
        }

        // Dual server-side validation via Zod
        const parsed = inquirySchema.safeParse(body);
        if (!parsed.success) {
          const fieldErrors = parsed.error.flatten().fieldErrors;
          return Response.json(
            {
              ok: false,
              error: "Please review the highlighted rental details",
              issues: fieldErrors,
            },
            { status: 422 }
          );
        }

        // Environment variables: safely prefer server service role or publishable keys
        const url =
          process.env["SUPABASE_URL"] ||
          process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
          process.env["VITE_SUPABASE_URL"];

        const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
        const publishableKey =
          serviceKey ||
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

        if (!url || !publishableKey) {
          console.error("[inquiry] Missing Supabase configuration in environment");
          return Response.json(
            { ok: false, error: "GearShare booking service is temporarily unavailable" },
            { status: 503 }
          );
        }

        const sb = createClient<Database>(url, publishableKey, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              // Supabase publishable keys starting with sb_ are opaque strings, not JWTs
              if (publishableKey.startsWith("sb_") && h.get("Authorization") === `Bearer ${publishableKey}`) {
                h.delete("Authorization");
              }
              h.set("apikey", publishableKey);
              return fetch(input, { ...init, headers: h });
            },
          },
        });

        const d = parsed.data;
        const inquiryId = crypto.randomUUID();
        const reference = `GS-MUM-${inquiryId.slice(0, 6).toUpperCase()}`;

        // Format rates into notes for complete persistence audit trail
        const rateTag = `[Rate: ₹${d.daily_rate.toLocaleString("en-IN")}/day]`;
        const compiledNotes = d.notes ? `${rateTag} ${d.notes}` : rateTag;

        const { error } = await sb.from("rental_inquiries").insert({
          id: inquiryId,
          gear_name: d.gear_name,
          category: d.category,
          start_date: d.start_date,
          end_date: d.end_date,
          customer_name: d.customer_name,
          customer_email: d.customer_email,
          customer_phone: d.customer_phone,
          notes: compiledNotes,
          status: "pending",
        });

        if (error) {
          console.error("[inquiry] Supabase insertion failed:", error.message, error.details);
          return Response.json(
            { ok: false, error: "Could not reserve equipment with dispatch desk. Please retry." },
            { status: 500 }
          );
        }

        // Lock booked dates in inventory_blocks so the seat-style calendar matrix locks in real-time
        try {
          const startDate = new Date(d.start_date + "T00:00:00");
          const endDate = new Date(d.end_date + "T00:00:00");
          const blockRows = [];
          const curr = new Date(startDate);
          
          while (curr <= endDate) {
            const y = curr.getFullYear();
            const m = String(curr.getMonth() + 1).padStart(2, "0");
            const day = String(curr.getDate()).padStart(2, "0");
            blockRows.push({
              gear_id: inquiryId,
              booking_id: inquiryId,
              block_date: `${y}-${m}-${day}`,
              block_type: "hold" as const,
            });
            curr.setDate(curr.getDate() + 1);
          }

          if (blockRows.length > 0) {
            await sb.from("inventory_blocks").insert(blockRows);
          }
        } catch (blockErr) {
          console.warn("[inquiry] Non-fatal calendar block warning:", blockErr);
        }

        return Response.json(
          {
            ok: true,
            reference,
            confirmation: {
              id: inquiryId,
              gear_name: d.gear_name,
              category: d.category,
              daily_rate: d.daily_rate,
              start_date: d.start_date,
              end_date: d.end_date,
              customer_name: d.customer_name,
              customer_email: d.customer_email,
            },
          },
          { status: 201 }
        );
      },
    },
  },
});
