import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db/queries/users";
import { getDeliverablesByUser } from "@/lib/db/queries/deliverables";
import { getClientsByUser } from "@/lib/db/queries/clients";
import { getHealthColour } from "@/lib/agency/health";
import { DeliverableActions } from "./DeliverableActions";

export const metadata = { title: "Deliverables — Venn" };

const PRIORITY_COLOURS: Record<string, string> = {
  low: "#555250", medium: "#C4973F", high: "#C0392B",
};

function startOfWeek(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() + 1); // Monday
  return d;
}

function endOfWeek(): Date {
  const d = startOfWeek();
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfNextWeek(): Date {
  const d = endOfWeek();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfNextWeek(): Date {
  const d = startOfNextWeek();
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default async function DeliverablesPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");
  const user = await getUserByClerkId(clerkId);
  if (!user) redirect("/sign-in");

  const [deliverables, clients] = await Promise.all([
    getDeliverablesByUser(user.id),
    getClientsByUser(user.id),
  ]);

  const now = new Date();
  const weekStart = startOfWeek();
  const weekEnd = endOfWeek();
  const nextWeekStart = startOfNextWeek();
  const nextWeekEnd = endOfNextWeek();

  const overdue = deliverables.filter(
    (d) => d.status !== "complete" && d.dueDate && new Date(d.dueDate) < now
  );

  // Group by day of this week
  const byDay: Record<string, typeof deliverables> = {};
  DAY_NAMES.forEach((_, i) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + i);
    const dayKey = dayDate.toISOString().split("T")[0];
    byDay[dayKey] = deliverables.filter((d) => {
      if (d.status === "complete") return false;
      if (!d.dueDate) return false;
      const due = new Date(d.dueDate);
      return due.toISOString().split("T")[0] === dayKey;
    });
  });

  const nextWeek = deliverables.filter((d) => {
    if (d.status === "complete") return false;
    if (!d.dueDate) return false;
    const due = new Date(d.dueDate);
    return due >= nextWeekStart && due <= nextWeekEnd;
  });

  const clientMap = new Map(clients.map((c) => [c.id, c]));

  function ClientBadge({ clientId }: { clientId: string }) {
    const c = clientMap.get(clientId);
    if (!c) return null;
    const healthColour = getHealthColour(c.healthScore);
    return (
      <Link href={`/clients/${c.id}`} style={{
        fontSize: 10, color: healthColour, fontFamily: "var(--font-inter)",
        background: "#1A1814", border: `0.5px solid ${healthColour}30`,
        borderRadius: 3, padding: "1px 6px", textDecoration: "none",
        textTransform: "uppercase", letterSpacing: "0.06em",
      }}>
        {c.businessName}
      </Link>
    );
  }

  function DeliverableRow({ d }: { d: typeof deliverables[0] }) {
    return (
      <div style={{
        background: "#0F0E0B", border: "0.5px solid #1E1C18", borderRadius: 6,
        padding: "11px 14px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <DeliverableActions deliverableId={d.id} currentStatus={d.status} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, color: d.status === "complete" ? "#444440" : "#FFFDF8", fontFamily: "var(--font-inter)", textDecoration: d.status === "complete" ? "line-through" : "none" }}>
            {d.title}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <ClientBadge clientId={d.clientId} />
          <span style={{ fontSize: 10, color: PRIORITY_COLOURS[d.priority], fontFamily: "var(--font-inter)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {d.priority}
          </span>
          <span style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>{d.category}</span>
        </div>
      </div>
    );
  }

  const totalPending = deliverables.filter((d) => d.status !== "complete").length;

  return (
    <div className="max-w-2xl">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", color: "#FFFDF8", fontWeight: 400 }}>
            Deliverables
          </h1>
          {totalPending > 0 && (
            <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", marginTop: 4 }}>
              {totalPending} pending across {clients.length} client{clients.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {deliverables.length === 0 && (
        <div style={{ textAlign: "center", paddingTop: 60 }}>
          <p style={{ fontSize: 16, color: "#555250", fontFamily: "var(--font-inter)" }}>
            No deliverables yet. Add them from individual client pages.
          </p>
        </div>
      )}

      {/* Overdue */}
      {overdue.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <p style={{ fontSize: 10, color: "#C0392B", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
              Overdue
            </p>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C0392B", display: "inline-block" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#1a080808", border: "0.5px solid #C0392B20", borderRadius: 8, padding: 12 }}>
            {overdue.map((d) => <DeliverableRow key={d.id} d={d} />)}
          </div>
        </div>
      )}

      {/* This week by day */}
      {Object.entries(byDay).map(([dayKey, dayDeliverables], i) => {
        if (dayDeliverables.length === 0) return null;
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + i);
        const isToday = dayDate.toDateString() === now.toDateString();
        return (
          <div key={dayKey} style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
              fontFamily: "var(--font-inter)", marginBottom: 10,
              color: isToday ? "#C4973F" : "#444440",
            }}>
              {DAY_NAMES[i]}{isToday ? " — Today" : ""} · {dayDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {dayDeliverables.map((d) => <DeliverableRow key={d.id} d={d} />)}
            </div>
          </div>
        );
      })}

      {/* Next week */}
      {nextWeek.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, color: "#444440", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-inter)", marginBottom: 10 }}>
            Next week
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {nextWeek.map((d) => <DeliverableRow key={d.id} d={d} />)}
          </div>
        </div>
      )}
    </div>
  );
}
