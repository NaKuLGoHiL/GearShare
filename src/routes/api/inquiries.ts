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
        let compiledNotes = d.notes ? `${rateTag} ${d.notes}` : rateTag;
        if (d.wica_card) compiledNotes += ` [WICA: ${d.wica_card}]`;
        if (d.gstin) compiledNotes += ` [GSTIN: ${d.gstin}]`;

        const startDt = new Date(d.start_date + "T00:00:00");
        const endDt = new Date(d.end_date + "T00:00:00");
        const totalDays = Math.max(1, Math.round((endDt.getTime() - startDt.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        const subtotal = d.daily_rate * totalDays;

        // Primary: Insert into rental_bookings
        const { error: bookingError } = await sb.from("rental_bookings").insert({
          id: inquiryId,
          reference_code: reference,
          customer_name: d.customer_name,
          customer_email: d.customer_email,
          customer_phone: d.customer_phone,
          shoot_start_date: d.start_date,
          shoot_return_date: d.end_date,
          total_days: totalDays,
          subtotal_inr: subtotal,
          total_amount_inr: subtotal,
          stage_destination: "Film City Studio 5 / Mumbai Stage",
          metro_hub: "Mumbai",
          status: "hold_requested",
          deposit_waiver_applied: Boolean(d.wica_card || d.gstin),
          notes: compiledNotes,
        });

        if (bookingError) {
          console.warn("[inquiry] rental_bookings notice:", bookingError.message);
          // Fallback to rental_inquiries if table exists
          await sb.from("rental_inquiries").insert({
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
        }

        // Lock booked dates in inventory_blocks so the seat-style calendar matrix locks in real-time
        try {
          const firstWord = d.gear_name.split(" ")[0] || "";
          const { data: matchedGear } = await sb
            .from("gear_inventory")
            .select("id")
            .ilike("name", `%${firstWord}%`)
            .limit(1)
            .maybeSingle();

          const targetGearId = matchedGear?.id;
          if (targetGearId) {
            const blockRows = [];
            const curr = new Date(startDt);
            while (curr <= endDt) {
              const y = curr.getFullYear();
              const m = String(curr.getMonth() + 1).padStart(2, "0");
              const day = String(curr.getDate()).padStart(2, "0");
              blockRows.push({
                gear_id: targetGearId,
                booking_id: inquiryId,
                block_date: `${y}-${m}-${day}`,
                block_type: "hold" as const,
              });
              curr.setDate(curr.getDate() + 1);
            }
            if (blockRows.length > 0) {
              await sb.from("inventory_blocks").insert(blockRows);
            }
          }
        } catch (blockErr) {
          console.warn("[inquiry] Calendar block note:", blockErr);
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
