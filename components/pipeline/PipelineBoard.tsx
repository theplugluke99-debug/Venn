"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  id: string;
  businessName: string;
  location: string;
  niche: string;
  intentScore: string;
  recommendedChannel: string;
  openingLine: string | null;
  pipelineStage: string;
  createdAt: string;
  updatedAt: string;
  card: { slug: string; viewCount: number; lastViewed: string | null } | null;
}

const COLUMNS = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "replied", label: "Replied" },
  { id: "meeting", label: "Meeting" },
  { id: "won", label: "Won" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

const INTENT_COLORS: Record<string, string> = {
  high: "#4CAF50",
  medium: "#C4973F",
  low: "#5b7db1",
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  email: "Email",
  linkedin: "LinkedIn",
};

function isHot(lastViewed: string | null): boolean {
  if (!lastViewed) return false;
  return Date.now() - new Date(lastViewed).getTime() < 86_400_000;
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: i % 3 === 0 ? "#C4973F" : i % 3 === 1 ? "#FFFDF8" : "#E8B44B",
    delay: Math.random() * 0.4,
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: "-5vh", rotate: p.rotation, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.rotation + 720, opacity: 0 }}
          transition={{ duration: 1.5, delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

function PipelineCard({
  lead,
  isDragging,
}: {
  lead: Lead;
  isDragging?: boolean;
}) {
  const hot = isHot(lead.card?.lastViewed ?? null);
  const days = daysSince(lead.updatedAt);

  return (
    <div
      style={{
        background: isDragging ? "#1A1814" : "#0F0E0B",
        border: "0.5px solid #1E1C18",
        borderLeft: `2px solid ${INTENT_COLORS[lead.intentScore] ?? "#444"}`,
        borderRadius: 8,
        padding: 12,
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      <div className="flex items-start justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 13, fontWeight: 500, color: "#FFFDF8", fontFamily: "var(--font-inter)", lineHeight: 1.2 }}>
            {lead.businessName}
          </span>
          {hot && (
            <span style={{ fontSize: 8, fontWeight: 700, background: "#C4973F", color: "#0A0907", padding: "1px 5px", borderRadius: 8, fontFamily: "var(--font-inter)" }}>
              HOT
            </span>
          )}
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)", marginBottom: 8 }}>
        {lead.location}
      </p>

      <div className="flex items-center gap-1.5">
        <span
          style={{
            fontSize: 10, background: `${INTENT_COLORS[lead.intentScore] ?? "#444"}15`,
            color: INTENT_COLORS[lead.intentScore] ?? "#444",
            border: `0.5px solid ${INTENT_COLORS[lead.intentScore] ?? "#444"}30`,
            padding: "1px 6px", borderRadius: 10, fontFamily: "var(--font-inter)", fontWeight: 500,
          }}
        >
          {lead.intentScore}
        </span>
        <span
          style={{
            fontSize: 10, background: "#1A1814", color: "#555250",
            border: "0.5px solid #1E1C18", padding: "1px 6px", borderRadius: 10, fontFamily: "var(--font-inter)",
          }}
        >
          {CHANNEL_LABELS[lead.recommendedChannel] ?? lead.recommendedChannel}
        </span>
        <span style={{ fontSize: 10, color: "#333230", fontFamily: "var(--font-inter)", marginLeft: "auto" }}>
          {days === 0 ? "Today" : `${days}d`}
        </span>
      </div>
    </div>
  );
}

function DraggablePipelineCard({ lead, onOpen }: { lead: Lead; onOpen: (l: Lead) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(lead)}
    >
      <PipelineCard lead={lead} isDragging={isDragging} />
    </div>
  );
}

function DroppableColumn({
  column,
  leads,
  onOpen,
}: {
  column: (typeof COLUMNS)[number];
  leads: Lead[];
  onOpen: (l: Lead) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: isOver ? "#1A1814" : "transparent",
        borderRadius: 8,
        transition: "background 0.15s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="flex items-center justify-between mb-3 px-1"
        style={{ paddingBottom: 8, borderBottom: "0.5px solid #1E1C18" }}
      >
        <span
          style={{
            fontSize: 11, color: "#444", textTransform: "uppercase",
            letterSpacing: "0.1em", fontWeight: 500, fontFamily: "var(--font-inter)",
          }}
        >
          {column.label}
        </span>
        {leads.length > 0 && (
          <span
            style={{
              fontSize: 10, background: "#1A1814", color: "#555250",
              border: "0.5px solid #1E1C18", padding: "1px 6px", borderRadius: 10,
              fontFamily: "var(--font-inter)",
            }}
          >
            {leads.length}
          </span>
        )}
      </div>

      <div ref={setNodeRef} className="space-y-2 flex-1 min-h-[80px] rounded-md p-1">
        {leads.map((lead) => (
          <DraggablePipelineCard key={lead.id} lead={lead} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function SlideOver({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [notes, setNotes] = useState("");

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 320,
          background: "#0F0E0B", borderLeft: "0.5px solid #1E1C18",
          display: "flex", flexDirection: "column", zIndex: 50,
        }}
      >
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "0.5px solid #1E1C18" }}>
          <h3 style={{ fontSize: 15, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif)" }}>
            {lead.businessName}
          </h3>
          <button onClick={onClose} style={{ color: "#555250", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
              Summary
            </p>
            <p style={{ fontSize: 12, color: "#555250", fontFamily: "var(--font-inter)" }}>
              {lead.location} · {lead.niche}
            </p>
            <div className="flex gap-1.5 mt-2">
              <span style={{ fontSize: 10, background: `${INTENT_COLORS[lead.intentScore]}15`, color: INTENT_COLORS[lead.intentScore], border: `0.5px solid ${INTENT_COLORS[lead.intentScore]}30`, padding: "1px 6px", borderRadius: 10, fontFamily: "var(--font-inter)" }}>
                {lead.intentScore} intent
              </span>
            </div>
          </div>

          {lead.openingLine && (
            <div>
              <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
                Opening line
              </p>
              <p style={{ fontSize: 12, color: "#888", fontStyle: "italic", fontFamily: "var(--font-instrument-serif)", lineHeight: 1.5 }}>
                &ldquo;{lead.openingLine}&rdquo;
              </p>
            </div>
          )}

          <div>
            <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-inter)", marginBottom: 6 }}>
              Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead…"
              rows={4}
              className="w-full px-3 py-2 rounded outline-none resize-none"
              style={{
                background: "#0A0907", border: "0.5px solid #1E1C18", color: "#FFFDF8",
                fontSize: 12, fontFamily: "var(--font-inter)", lineHeight: 1.6,
              }}
            />
          </div>

          <div className="space-y-2">
            <Link
              href={`/leads/${lead.id}`}
              style={{
                display: "block", textAlign: "center", padding: "8px 16px", borderRadius: 6,
                background: "#C4973F", color: "#0A0907", fontSize: 13, fontWeight: 500,
                fontFamily: "var(--font-inter)", textDecoration: "none",
              }}
            >
              View full profile
            </Link>
            {lead.card && (
              <Link
                href={`/card/${lead.card.slug}`}
                target="_blank"
                style={{
                  display: "block", textAlign: "center", padding: "8px 16px", borderRadius: 6,
                  background: "#1A1814", color: "#888", fontSize: 13, fontFamily: "var(--font-inter)",
                  textDecoration: "none", border: "0.5px solid #1E1C18",
                }}
              >
                View prospect card
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function PipelineBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [openLead, setOpenLead] = useState<Lead | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const lead = leads.find((l) => l.id === event.active.id);
    setActiveLead(lead ?? null);
  }, [leads]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;

    const leadId = String(active.id);
    const newStage = String(over.id) as ColumnId;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.pipelineStage === newStage) return;

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, pipelineStage: newStage } : l))
    );

    if (newStage === "won") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    try {
      await fetch(`/api/pipeline/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipelineStage: newStage }),
      });
    } catch {
      // Revert on error
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, pipelineStage: lead.pipelineStage } : l))
      );
    }
  }, [leads]);

  const leadsByColumn = (columnId: string) =>
    leads.filter((l) => l.pipelineStage === columnId);

  return (
    <>
      <Confetti active={showConfetti} />

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "70vh" }}>
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {COLUMNS.map((col) => (
            <DroppableColumn
              key={col.id}
              column={col}
              leads={leadsByColumn(col.id)}
              onOpen={setOpenLead}
            />
          ))}

          <DragOverlay>
            {activeLead && <PipelineCard lead={activeLead} />}
          </DragOverlay>
        </DndContext>
      </div>

      <AnimatePresence>
        {openLead && (
          <SlideOver lead={openLead} onClose={() => setOpenLead(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
