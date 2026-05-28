"use client";

import { useState, useCallback } from "react";

export interface ColdCallScript {
  opener: string;
  permission: string;
  observation: string;
  pivot: string;
  close: string;
  ifTheyAreInterested: string;
  ifTheyAreNotInterested: string;
  ifVoicemail: string;
}

export interface VideoScript {
  intro: string;
  whatToShow: string[];
  whatToSay: string;
  close: string;
}

interface ChannelStatus {
  sent?: boolean;
  notes?: string;
  repliedAt?: string;
}

interface Arsenal {
  voiceNoteScript: string | null;
  coldCallScript: ColdCallScript | null;
  linkedinNote: string | null;
  linkedinFollowUp1: string | null;
  linkedinFollowUp2: string | null;
  emailSubject1: string | null;
  emailBody1: string | null;
  emailSubject2: string | null;
  emailBody2: string | null;
  emailSubject3: string | null;
  emailBody3: string | null;
  videoScript: VideoScript | null;
  channelStatus: Record<string, ChannelStatus> | null;
}

interface Props {
  leadId: string;
  initialArsenal: Arsenal | null;
  businessName: string;
  leadEmail: string | null;
  useColdCall: boolean;
  useVideoMessage: boolean;
  canUse: boolean;
}

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  color: "#444",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 500,
  fontFamily: "var(--font-inter)",
  marginBottom: 12,
};

const CARD: React.CSSProperties = {
  background: "#0F0E0B",
  border: "0.5px solid #1E1C18",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
};

const SCRIPT_TEXT: React.CSSProperties = {
  fontSize: 14,
  color: "#FFFDF8",
  lineHeight: 1.8,
  fontFamily: "var(--font-inter)",
  whiteSpace: "pre-wrap",
};

const LABEL_SMALL: React.CSSProperties = {
  fontSize: 10,
  color: "#555250",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 500,
  fontFamily: "var(--font-inter)",
  marginBottom: 4,
};

const HELPER: React.CSSProperties = {
  fontSize: 11,
  color: "#555250",
  fontFamily: "var(--font-inter)",
  lineHeight: 1.5,
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        fontSize: 11,
        color: copied ? "#4CAF50" : "#555250",
        background: "none",
        border: "0.5px solid " + (copied ? "#4CAF5040" : "#1E1C18"),
        borderRadius: 4,
        padding: "3px 10px",
        cursor: "pointer",
        fontFamily: "var(--font-inter)",
        transition: "all 0.2s",
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CharCount({ text, limit }: { text: string; limit: number }) {
  const len = text.length;
  const over = len > limit;
  return (
    <span style={{ fontSize: 11, color: over ? "#ef4444" : "#444", fontFamily: "var(--font-inter)" }}>
      {len}/{limit}
    </span>
  );
}

function VoiceNoteTab({ script }: { script: string }) {
  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  return (
    <div>
      <div style={{ ...CARD, borderLeft: "2px solid #C4973F" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={SECTION_LABEL}>Voice note script</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)" }}>{wordCount} words</span>
            <CopyBtn text={script} />
          </div>
        </div>
        <p style={SCRIPT_TEXT}>{script}</p>
      </div>
      <div style={{ ...CARD, background: "#080806" }}>
        <p style={{ ...HELPER, marginBottom: 4 }}>
          <strong style={{ color: "#888580" }}>Record this</strong>
        </p>
        <p style={HELPER}>
          Record a WhatsApp voice note using this script. Speak naturally — don&apos;t read word for word.
          Aim for 25–35 seconds. Send the card link in a follow-up message immediately after.
        </p>
      </div>
    </div>
  );
}

function ColdCallTab({ script }: { script: ColdCallScript }) {
  const [showExpanded, setShowExpanded] = useState<string | null>(null);
  const sections = [
    { key: "opener", label: "Opener" },
    { key: "permission", label: "Permission ask" },
    { key: "observation", label: "Your observation" },
    { key: "pivot", label: "Pivot to card" },
    { key: "close", label: "The ask" },
  ] as const;
  const expandable = [
    { key: "ifTheyAreInterested", label: "If they're interested" },
    { key: "ifTheyAreNotInterested", label: "If they're not interested" },
    { key: "ifVoicemail", label: "If voicemail" },
  ] as const;

  const fullScript = [
    script.opener, script.permission, script.observation,
    script.pivot, script.close,
  ].join("\n\n");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={SECTION_LABEL}>Call guide</p>
        <CopyBtn text={fullScript} />
      </div>
      {sections.map(({ key, label }) => (
        <div key={key} style={CARD}>
          <p style={LABEL_SMALL}>{label}</p>
          <p style={{ ...SCRIPT_TEXT, fontSize: 14 }}>{script[key]}</p>
        </div>
      ))}
      <div style={{ marginTop: 16 }}>
        <p style={{ ...SECTION_LABEL, marginBottom: 8 }}>Scenarios</p>
        {expandable.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: 8 }}>
            <button
              onClick={() => setShowExpanded(showExpanded === key ? null : key)}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                background: "#0F0E0B",
                border: "0.5px solid #1E1C18",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                color: "#888580",
                fontFamily: "var(--font-inter)",
              }}
            >
              {label}
              <span style={{ color: "#444" }}>{showExpanded === key ? "▲" : "▼"}</span>
            </button>
            {showExpanded === key && (
              <div style={{ padding: "12px 14px", background: "#080806", borderRadius: "0 0 6px 6px", border: "0.5px solid #1E1C18", borderTop: "none" }}>
                <p style={{ ...SCRIPT_TEXT, fontSize: 13 }}>{script[key]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkedInTab({ note, followUp1, followUp2, businessName }: {
  note: string; followUp1: string; followUp2: string; businessName: string;
}) {
  const liSearchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(businessName)}`;
  return (
    <div>
      <div style={{ ...CARD, borderLeft: "2px solid #0077B5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={LABEL_SMALL}>Connection request note</p>
          <div style={{ display: "flex", gap: 8 }}>
            <CharCount text={note} limit={290} />
            <CopyBtn text={note} />
          </div>
        </div>
        <p style={SCRIPT_TEXT}>{note}</p>
      </div>
      <div style={CARD}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={LABEL_SMALL}>Day 3 follow-up</p>
          <div style={{ display: "flex", gap: 8 }}>
            <CharCount text={followUp1} limit={200} />
            <CopyBtn text={followUp1} />
          </div>
        </div>
        <p style={SCRIPT_TEXT}>{followUp1}</p>
      </div>
      <div style={CARD}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={LABEL_SMALL}>Day 7 — final touch</p>
          <div style={{ display: "flex", gap: 8 }}>
            <CharCount text={followUp2} limit={150} />
            <CopyBtn text={followUp2} />
          </div>
        </div>
        <p style={SCRIPT_TEXT}>{followUp2}</p>
      </div>
      <a
        href={liSearchUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          color: "#0077B5",
          textDecoration: "none",
          fontFamily: "var(--font-inter)",
        }}
      >
        Open their LinkedIn →
      </a>
    </div>
  );
}

function EmailTab({ s1, b1, s2, b2, s3, b3, leadEmail }: {
  s1: string; b1: string; s2: string; b2: string; s3: string; b3: string; leadEmail: string | null;
}) {
  const emails = [
    { day: "Day 1", subject: s1, body: b1, color: "#C4973F" },
    { day: "Day 5", subject: s2, body: b2, color: "#888580" },
    { day: "Day 10", subject: s3, body: b3, color: "#555250" },
  ];
  return (
    <div>
      {/* Timeline */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {emails.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                border: `1.5px solid ${e.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: e.color, fontFamily: "var(--font-inter)", fontWeight: 600,
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 9, color: "#444", fontFamily: "var(--font-inter)", marginTop: 3, whiteSpace: "nowrap" }}>{e.day}</p>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: "#1E1C18", minWidth: 32 }} />}
          </div>
        ))}
      </div>

      {emails.map(({ day, subject, body, color }, i) => (
        <div key={i} style={{ ...CARD, borderLeft: `2px solid ${color}`, marginBottom: 16 }}>
          <p style={{ ...LABEL_SMALL, color }}>{day}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, color: "#444", fontFamily: "var(--font-inter)", marginBottom: 3 }}>Subject</p>
              <p style={{ fontSize: 14, color: "#FFFDF8", fontFamily: "var(--font-inter)", fontWeight: 500 }}>{subject}</p>
            </div>
            <CopyBtn text={subject} />
          </div>
          <div style={{ borderTop: "0.5px solid #1E1C18", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <p style={{ ...SCRIPT_TEXT, flex: 1, fontSize: 13 }}>{body}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <CopyBtn text={`Subject: ${subject}\n\n${body}`} />
              {leadEmail && (
                <a
                  href={`mailto:${leadEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                  style={{ fontSize: 11, color: "#C4973F", textDecoration: "none", fontFamily: "var(--font-inter)" }}
                >
                  Open →
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VideoTab({ script }: { script: VideoScript }) {
  return (
    <div>
      <div style={CARD}>
        <p style={LABEL_SMALL}>Intro (first 10 seconds)</p>
        <p style={SCRIPT_TEXT}>{script.intro}</p>
      </div>
      <div style={CARD}>
        <p style={LABEL_SMALL}>What to show on screen</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {script.whatToShow.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#1A1814", border: "0.5px solid #1E1C18",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, color: "#C4973F", fontFamily: "var(--font-inter)", flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <p style={{ ...SCRIPT_TEXT, fontSize: 13 }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...CARD, borderLeft: "2px solid #C4973F" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={LABEL_SMALL}>What to say (narration)</p>
          <CopyBtn text={script.whatToSay} />
        </div>
        <p style={SCRIPT_TEXT}>{script.whatToSay}</p>
      </div>
      <div style={CARD}>
        <p style={LABEL_SMALL}>Close (final 10 seconds)</p>
        <p style={SCRIPT_TEXT}>{script.close}</p>
      </div>
      <a
        href="https://www.loom.com/record"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, color: "#625DF5", textDecoration: "none", fontFamily: "var(--font-inter)",
        }}
      >
        Record with Loom →
      </a>
    </div>
  );
}

function StatusTab({
  channelStatus,
  onUpdate,
  useColdCall,
  useVideoMessage,
}: {
  channelStatus: Record<string, ChannelStatus>;
  onUpdate: (status: Record<string, ChannelStatus>) => void;
  useColdCall: boolean;
  useVideoMessage: boolean;
}) {
  const channels = [
    { key: "voice", label: "Voice note" },
    { key: "coldCall", label: "Cold call", hidden: !useColdCall },
    { key: "linkedin", label: "LinkedIn" },
    { key: "email", label: "Email sequence" },
    { key: "video", label: "Video message", hidden: !useVideoMessage },
  ].filter((c) => !c.hidden);

  const [notes, setNotes] = useState<Record<string, string>>(() =>
    Object.fromEntries(channels.map((c) => [c.key, channelStatus[c.key]?.notes ?? ""]))
  );

  const toggle = (key: string, field: "sent") => {
    const updated = {
      ...channelStatus,
      [key]: { ...channelStatus[key], [field]: !channelStatus[key]?.[field] },
    };
    onUpdate(updated);
  };

  const logReply = (key: string) => {
    const updated = {
      ...channelStatus,
      [key]: { ...channelStatus[key], repliedAt: new Date().toISOString() },
    };
    onUpdate(updated);
  };

  const saveNotes = (key: string) => {
    const updated = {
      ...channelStatus,
      [key]: { ...channelStatus[key], notes: notes[key] },
    };
    onUpdate(updated);
  };

  return (
    <div>
      {channels.map(({ key, label }) => {
        const s = channelStatus[key] ?? {};
        return (
          <div key={key} style={CARD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  onClick={() => toggle(key, "sent")}
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `1.5px solid ${s.sent ? "#C4973F" : "#333"}`,
                    background: s.sent ? "#C4973F15" : "transparent",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {s.sent && <span style={{ color: "#C4973F", fontSize: 11 }}>✓</span>}
                </button>
                <p style={{ fontSize: 13, color: s.sent ? "#FFFDF8" : "#555250", fontFamily: "var(--font-inter)" }}>
                  {label}
                </p>
                {s.repliedAt && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, background: "#C4973F",
                    color: "#0A0907", padding: "2px 6px", borderRadius: 8, fontFamily: "var(--font-inter)",
                  }}>
                    REPLIED
                  </span>
                )}
              </div>
              {s.sent && !s.repliedAt && (
                <button
                  onClick={() => logReply(key)}
                  style={{
                    fontSize: 11, color: "#4CAF50", background: "none",
                    border: "0.5px solid #4CAF5040", borderRadius: 4, padding: "3px 8px",
                    cursor: "pointer", fontFamily: "var(--font-inter)",
                  }}
                >
                  Log reply
                </button>
              )}
            </div>
            {s.sent && (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={notes[key] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [key]: e.target.value }))}
                  onBlur={() => saveNotes(key)}
                  placeholder="Notes..."
                  style={{
                    flex: 1, background: "#0A0907", border: "0.5px solid #1E1C18",
                    borderRadius: 4, padding: "6px 10px", fontSize: 12,
                    color: "#FFFDF8", fontFamily: "var(--font-inter)", outline: "none",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ArsenalSection({ leadId, initialArsenal, businessName, leadEmail, useColdCall, useVideoMessage, canUse }: Props) {
  const [arsenal, setArsenal] = useState<Arsenal | null>(initialArsenal);
  const [generating, setGenerating] = useState(false);
  const [dots, setDots] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [confirmRegen, setConfirmRegen] = useState(false);

  const generate = useCallback(async () => {
    setGenerating(true);
    const interval = setInterval(() => setDots((d) => (d % 3) + 1), 500);
    try {
      const res = await fetch(`/api/arsenal/${leadId}`, { method: "POST" });
      const data = await res.json() as Arsenal;
      setArsenal(data);
    } catch (e) {
      console.error(e);
    } finally {
      clearInterval(interval);
      setGenerating(false);
      setConfirmRegen(false);
    }
  }, [leadId]);

  const updateStatus = useCallback(async (status: Record<string, ChannelStatus>) => {
    setArsenal((a) => a ? { ...a, channelStatus: status } : a);
    await fetch(`/api/arsenal/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelStatus: status }),
    }).catch(() => null);
  }, [leadId]);

  const tabs = [
    { id: "voice", label: "Voice note" },
    { id: "coldCall", label: "Cold call", hidden: !useColdCall },
    { id: "linkedin", label: "LinkedIn" },
    { id: "email", label: "Email" },
    { id: "video", label: "Video", hidden: !useVideoMessage },
    { id: "status", label: "Track" },
  ].filter((t) => !t.hidden);

  return (
    <div style={{ marginTop: 40, borderTop: "0.5px solid #1E1C18", paddingTop: 32 }}>
      <p style={{ ...SECTION_LABEL, color: "#C4973F", marginBottom: 16 }}>Outreach Arsenal</p>

      {!canUse && (
        <div style={{ ...CARD, border: "0.5px solid #C4973F30" }}>
          <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)" }}>
            Arsenal is available on Growth plan and above. Upgrade to generate your complete outreach toolkit.
          </p>
        </div>
      )}

      {canUse && !arsenal && !generating && (
        <div style={{ ...CARD, border: "0.5px solid #1E1C18", padding: 24 }}>
          <h3 style={{ fontSize: 16, color: "#FFFDF8", fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif", marginBottom: 8 }}>
            Your complete outreach toolkit
          </h3>
          <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", lineHeight: 1.7, marginBottom: 20 }}>
            Generate everything you need to pursue this lead on any channel. Voice note script.
            Cold call guide. LinkedIn sequence. Three-email sequence. Video script.
          </p>
          <button
            onClick={generate}
            style={{
              fontSize: 13, color: "#C4973F", background: "none",
              border: "0.5px solid #C4973F40", borderRadius: 6, padding: "10px 20px",
              cursor: "pointer", fontFamily: "var(--font-inter)", transition: "all 0.2s",
            }}
          >
            Generate arsenal →
          </button>
        </div>
      )}

      {canUse && generating && (
        <div style={{ ...CARD, padding: 24, textAlign: "center" }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            border: "1.5px solid #1E1C18", borderTop: "1.5px solid #C4973F",
            animation: "spin 1s linear infinite", margin: "0 auto 16px",
          }} />
          <p style={{ fontSize: 14, color: "#888580", fontFamily: "var(--font-inter)" }}>
            Building your toolkit{"." .repeat(dots)}
          </p>
          <p style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-inter)", marginTop: 6 }}>
            Claude is writing personalised content for {businessName}. Takes about 20 seconds.
          </p>
        </div>
      )}

      {canUse && arsenal && !generating && (
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid #1E1C18", marginBottom: 20 }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                style={{
                  fontSize: 12,
                  color: activeTab === i ? "#C4973F" : "#555250",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === i ? "2px solid #C4973F" : "2px solid transparent",
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontFamily: "var(--font-inter)",
                  marginBottom: -1,
                  transition: "color 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tabs[activeTab]?.id === "voice" && arsenal.voiceNoteScript && (
            <VoiceNoteTab script={arsenal.voiceNoteScript} />
          )}
          {tabs[activeTab]?.id === "coldCall" && arsenal.coldCallScript && (
            <ColdCallTab script={arsenal.coldCallScript} />
          )}
          {tabs[activeTab]?.id === "linkedin" && (
            <LinkedInTab
              note={arsenal.linkedinNote ?? ""}
              followUp1={arsenal.linkedinFollowUp1 ?? ""}
              followUp2={arsenal.linkedinFollowUp2 ?? ""}
              businessName={businessName}
            />
          )}
          {tabs[activeTab]?.id === "email" && (
            <EmailTab
              s1={arsenal.emailSubject1 ?? ""}
              b1={arsenal.emailBody1 ?? ""}
              s2={arsenal.emailSubject2 ?? ""}
              b2={arsenal.emailBody2 ?? ""}
              s3={arsenal.emailSubject3 ?? ""}
              b3={arsenal.emailBody3 ?? ""}
              leadEmail={leadEmail}
            />
          )}
          {tabs[activeTab]?.id === "video" && arsenal.videoScript && (
            <VideoTab script={arsenal.videoScript} />
          )}
          {tabs[activeTab]?.id === "status" && (
            <StatusTab
              channelStatus={(arsenal.channelStatus as Record<string, ChannelStatus>) ?? {}}
              onUpdate={updateStatus}
              useColdCall={useColdCall}
              useVideoMessage={useVideoMessage}
            />
          )}

          {/* Regenerate */}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            {!confirmRegen ? (
              <button
                onClick={() => setConfirmRegen(true)}
                style={{
                  fontSize: 11, color: "#333230", background: "none",
                  border: "none", cursor: "pointer", fontFamily: "var(--font-inter)",
                  textDecoration: "underline",
                }}
              >
                Regenerate arsenal
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#555250", fontFamily: "var(--font-inter)" }}>
                  This will overwrite existing content.
                </span>
                <button
                  onClick={generate}
                  style={{
                    fontSize: 11, color: "#C4973F", background: "none",
                    border: "0.5px solid #C4973F40", borderRadius: 4, padding: "3px 8px",
                    cursor: "pointer", fontFamily: "var(--font-inter)",
                  }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmRegen(false)}
                  style={{
                    fontSize: 11, color: "#444", background: "none",
                    border: "none", cursor: "pointer", fontFamily: "var(--font-inter)",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
