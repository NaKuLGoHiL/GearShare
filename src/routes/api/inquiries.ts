import { createFileRoute } from "@tanstack/react-router";
import { inquirySchema } from "@/lib/inquiry";

export const Route = createFileRoute("/api/inquiries")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = inquirySchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
            { status: 422 },
          );
        }
        const ref = `GS-${Date.now().toString(36).toUpperCase()}`;
        console.log("[inquiry]", ref, parsed.data.gear, parsed.data.startDate);
        return Response.json({ ok: true, reference: ref }, { status: 201 });
      },
    },
  },
});
