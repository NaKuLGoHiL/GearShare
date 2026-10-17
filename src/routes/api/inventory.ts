import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/inventory")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const urlObj = new URL(request.url);
        const category = urlObj.searchParams.get("category");
        const mount = urlObj.searchParams.get("mount");
        const search = urlObj.searchParams.get("search")?.toLowerCase().trim();

        const sbUrl =
          process.env["SUPABASE_URL"] ||
          process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
          process.env["VITE_SUPABASE_URL"];

        const sbKey =
          process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
          process.env["SUPABASE_PUBLISHABLE_KEY"] ||
          process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

        if (!sbUrl || !sbKey) {
          return Response.json({
            ok: true,
            source: "local_cache",
            count: 0,
            inventory: [],
          });
        }

        try {
          const sb = createClient<Database>(sbUrl, sbKey, {
            auth: { persistSession: false, autoRefreshToken: false },
            global: {
              fetch: (input, init) => {
                const h = new Headers(init?.headers);
                if (sbKey.startsWith("sb_") && h.get("Authorization") === `Bearer ${sbKey}`) {
                  h.delete("Authorization");
                }
                h.set("apikey", sbKey);
                return fetch(input, { ...init, headers: h });
              },
            },
          });

          let query = sb
            .from("gear_inventory")
            .select("*")
            .neq("status", "retired")
            .order("base_daily_rate", { ascending: false });

          if (category && category !== "All") {
            query = query.eq("category", category);
          }

          if (mount && mount !== "All") {
            query = query.ilike("mount_type", `%${mount}%`);
          }

          const { data, error } = await query;

          if (error || !data) {
            console.warn("[inventory] Query error:", error?.message);
            return Response.json({
              ok: true,
              source: "fallback",
              inventory: [],
            });
          }

          let items = data.map((item) => ({
            id: item.id,
            slug: item.slug,
            name: item.name,
            brand: item.brand,
            category: item.category,
            rate: Number(item.base_daily_rate),
            mount: item.mount_type ?? undefined,
            sensor: item.sensor_type ?? undefined,
            specs: Array.isArray(item.specs) ? item.specs : [],
            packageIncludes: Array.isArray(item.included_accessories)
              ? item.included_accessories.join(", ")
              : undefined,
            highlight: item.badge ?? undefined,
            status: item.status,
            replacementValue: Number(item.replacement_value),
            hub: "Mumbai Film City Bay 1",
            inStockCount: 3,
          }));

          if (search) {
            items = items.filter(
              (i) =>
                i.name.toLowerCase().includes(search) ||
                i.brand.toLowerCase().includes(search) ||
                i.category.toLowerCase().includes(search) ||
                i.specs.some((s) => s.toLowerCase().includes(search))
            );
          }

          return Response.json({
            ok: true,
            source: "supabase_live",
            count: items.length,
            inventory: items,
          });
        } catch (err) {
          console.error("[inventory] Unexpected error:", err);
          return Response.json({
            ok: true,
            source: "fallback",
            inventory: [],
          });
        }
      },
    },
  },
});
