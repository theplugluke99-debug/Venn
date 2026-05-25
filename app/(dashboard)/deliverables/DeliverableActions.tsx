"use client";

import { useRouter } from "next/navigation";

export function DeliverableActions({ deliverableId, currentStatus }: { deliverableId: string; currentStatus: string }) {
  const router = useRouter();

  async function toggle() {
    const newStatus = currentStatus === "complete" ? "pending" : "complete";
    await fetch(`/api/deliverables/${deliverableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      style={{
        width: 18, height: 18, borderRadius: 4,
        border: `1.5px solid ${currentStatus === "complete" ? "#4CAF50" : "#333"}`,
        background: currentStatus === "complete" ? "#4CAF50" : "transparent",
        cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {currentStatus === "complete" && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#0A0907" strokeWidth="2">
          <polyline points="1,5 4,8 9,2" />
        </svg>
      )}
    </button>
  );
}
