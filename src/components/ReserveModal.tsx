import { useEffect, useState, type FormEvent } from "react";
import { inquirySchema } from "@/lib/inquiry";

export type Gear = { name: string; category: string; rate: number };

const field =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring";

export function ReserveModal({ gear, onClose }: { gear: Gear | null; onClose: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setErrors({}); setRef(null); setServerError(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gear, onClose]);

  if (!gear) return null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      gear: gear!.name, category: gear!.category, dailyRate: gear!.rate,
      name: String(fd.get("name") ?? ""), email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""), startDate: String(fd.get("startDate") ?? ""),
      returnDate: String(fd.get("returnDate") ?? ""), notes: String(fd.get("notes") ?? ""),
    };
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])));
      return;
    }
    setErrors({}); setServerError(null); setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Request failed");
      setRef(json.reference);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const Err = ({ k }: { k: string }) =>
    errors[k] ? <p className="mt-1 font-mono text-xs text-destructive">{errors[k]}</p> : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={`Reserve ${gear.name}`}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-popover p-6 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{gear.category}</p>
            <h3 className="mt-1 text-xl font-semibold">{gear.name}</h3>
            <p className="mt-1 font-mono text-sm text-muted-foreground">${gear.rate}/day</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {ref ? (
          <div className="rounded-lg border border-success/40 bg-success/10 p-4">
            <p className="font-semibold text-success">Inquiry received</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Reference <span className="font-mono text-foreground">{ref}</span>. Our dispatch desk will confirm availability shortly.
            </p>
            <button onClick={onClose} className="mt-4 rounded-full bg-secondary px-4 py-2 text-sm">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4">
            <div><input name="name" placeholder="Customer Name" className={field} /><Err k="name" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><input name="email" type="email" placeholder="Work Email" className={field} /><Err k="email" /></div>
              <div><input name="phone" type="tel" placeholder="Contact Phone" className={field} /><Err k="phone" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-mono text-xs text-muted-foreground">Shoot Start
                <input name="startDate" type="date" className={`${field} mt-1`} /><Err k="startDate" /></label>
              <label className="font-mono text-xs text-muted-foreground">Return
                <input name="returnDate" type="date" className={`${field} mt-1`} /><Err k="returnDate" /></label>
            </div>
            <div><textarea name="notes" rows={3} placeholder="Production Notes" className={field} /><Err k="notes" /></div>
            {serverError && <p className="font-mono text-xs text-destructive">{serverError}</p>}
            <button disabled={loading} className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />}
              {loading ? "Sending…" : "Submit Inquiry"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
