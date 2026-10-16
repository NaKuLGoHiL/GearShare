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
          return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
        }
        const parsed = inquirySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Please check the highlighted fields", issues: parsed.error.flatten().fieldErrors },
            { status: 422 },
          );
        }
        const url = process.env["SUPABASE_URL"];
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !key) {
          return Response.json({ ok: false, error: "Booking service unavailable" }, { status: 503 });
        }
        const sb = createClient<Database>(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });
        const d = parsed.data;
        const id = crypto.randomUUID();
        const { error } = await sb.from("rental_inquiries").insert({
          id,
          gear_name: d.gear,
          category: d.category,
          start_date: d.startDate,
          end_date: d.returnDate,
          customer_name: d.name,
          customer_email: d.email,
          customer_phone: d.phone,
          notes: d.notes ?? "",
        });
        if (error) {
          console.error("[inquiry] insert failed", error.message);
          return Response.json({ ok: false, error: "Could not save your booking. Please try again." }, { status: 500 });
        }
        return Response.json({ ok: true, reference: `GS-${id.slice(0, 8).toUpperCase()}` }, { status: 201 });
      },
    },
  },
});
