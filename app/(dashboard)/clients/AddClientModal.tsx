"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Lead { id: string; businessName: string; }

interface AddClientModalProps {
  leads: Lead[];
  primary?: boolean;
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: 6,
  border: "0.5px solid #1E1C18", background: "#0A0907",
  color: "#FFFDF8", fontSize: 13, fontFamily: "var(--font-inter)",
  outline: "none", boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)",
  textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6, display: "block",
};

export function AddClientModal({ leads, primary }: AddClientModalProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    businessName: "", ownerName: "", email: "", phone: "",
    website: "", niche: "", location: "", contractValue: "",
    billingCycle: "monthly", startDate: new Date().toISOString().split("T")[0],
    contractEndDate: "", notes: "", leadId: "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          contractValue: form.contractValue ? parseFloat(form.contractValue) : undefined,
          leadId: form.leadId || undefined,
          contractEndDate: form.contractEndDate || undefined,
        }),
      });
      const data = await res.json() as { client?: { id: string }; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setOpen(false);
      router.push(`/clients/${data.client!.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: primary ? "#C4973F" : "transparent",
          color: primary ? "#0A0907" : "#C4973F",
          border: primary ? "none" : "0.5px solid #C4973F40",
          borderRadius: 6, padding: "9px 16px", fontSize: 13, fontWeight: 500,
          fontFamily: "var(--font-inter)", cursor: "pointer",
        }}
      >
        {primary ? "Add your first client →" : "Add client +"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10,9,7,0.88)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 12,
            width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
            padding: 28,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 18, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8" }}>
                Add client
              </p>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#555250", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={LABEL_STYLE}>Business name *</label>
                  <input style={INPUT_STYLE} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Owner name</label>
                    <input style={INPUT_STYLE} value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Email</label>
                    <input style={INPUT_STYLE} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Monthly value (£) *</label>
                    <input style={INPUT_STYLE} type="number" min="0" value={form.contractValue} onChange={(e) => set("contractValue", e.target.value)} placeholder="0" />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Billing cycle</label>
                    <select style={INPUT_STYLE} value={form.billingCycle} onChange={(e) => set("billingCycle", e.target.value)}>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Start date</label>
                    <input style={INPUT_STYLE} type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Contract end date</label>
                    <input style={INPUT_STYLE} type="date" value={form.contractEndDate} onChange={(e) => set("contractEndDate", e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={LABEL_STYLE}>Niche</label>
                    <input style={INPUT_STYLE} value={form.niche} onChange={(e) => set("niche", e.target.value)} placeholder="e.g. Aesthetics clinic" />
                  </div>
                  <div>
                    <label style={LABEL_STYLE}>Location</label>
                    <input style={INPUT_STYLE} value={form.location} onChange={(e) => set("location", e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={LABEL_STYLE}>Website</label>
                  <input style={INPUT_STYLE} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />
                </div>

                {leads.length > 0 && (
                  <div>
                    <label style={LABEL_STYLE}>Connect to existing lead (optional)</label>
                    <select style={INPUT_STYLE} value={form.leadId} onChange={(e) => set("leadId", e.target.value)}>
                      <option value="">— No lead connection —</option>
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>{l.businessName}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label style={LABEL_STYLE}>Notes</label>
                  <textarea
                    style={{ ...INPUT_STYLE, minHeight: 72, resize: "vertical" }}
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Anything worth noting about this client..."
                  />
                </div>

                {error && (
                  <p style={{ fontSize: 12, color: "#C0392B", fontFamily: "var(--font-inter)" }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={saving || !form.businessName}
                  style={{
                    background: "#C4973F", color: "#0A0907", border: "none",
                    borderRadius: 6, padding: "11px", fontSize: 13, fontWeight: 500,
                    fontFamily: "var(--font-inter)", cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving || !form.businessName ? 0.6 : 1,
                  }}
                >
                  {saving ? "Adding..." : "Add client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
