import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/marketing/SiteNav";
import { HeroWords } from "@/components/marketing/HeroWords";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";

export const metadata: Metadata = {
  title: "Venn — The Prospect Engine for Agency Owners",
  description:
    "Find local businesses, analyse their reviews, score their intent and generate personalised prospect cards automatically. Replaces Apollo, Clay and digital sales rooms at a fraction of the cost.",
};

const gold = "#C4973F";
const ivory = "#FFFDF8";
const bg = "#0A0907";
const surface = "#0F0E0B";
const muted = "#888580";
const border = "#1E1C18";

const serif = "var(--font-instrument-serif), Georgia, serif";
const sans = "var(--font-inter), Inter, system-ui, sans-serif";

export default function LandingPage() {
  return (
    <div style={{ background: bg, color: ivory, fontFamily: sans, overflowX: "hidden" }}>
      <SiteNav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "96px 24px 64px",
          position: "relative",
        }}
      >
        {/* Venn diagram background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <svg
            width="900"
            height="900"
            viewBox="0 0 900 900"
            style={{
              opacity: 0.03,
              animation: "slowSpin 120s linear infinite",
            }}
          >
            <circle cx="350" cy="450" r="280" fill="none" stroke={gold} strokeWidth="1" />
            <circle cx="550" cy="450" r="280" fill="none" stroke={gold} strokeWidth="1" />
            <circle cx="450" cy="300" r="280" fill="none" stroke={gold} strokeWidth="1" />
          </svg>
        </div>

        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <p
            style={{
              fontSize: 10,
              color: gold,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 500,
              marginBottom: 24,
            }}
          >
            The Prospect Engine
          </p>

          <HeroWords />

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: muted,
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Venn finds local businesses, reads their Google Reviews, audits their website, scores their intent and writes your opening line. Then generates a personalised prospect card that shows their own business data back at them.
            <br /><br />
            Not a database. Not a template.<br />
            A prospect engine that thinks.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
            <Link
              href="/sign-up"
              style={{
                padding: "14px 28px",
                borderRadius: 8,
                background: gold,
                color: bg,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Start free — no card needed
            </Link>
            <a
              href="#how-it-works"
              style={{
                padding: "14px 28px",
                borderRadius: 8,
                border: `0.5px solid #3A3632`,
                color: "#FFFDF8",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = gold + "60")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3A3632")}
            >
              See how it works
            </a>
          </div>

          {/* Social proof row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              flexWrap: "wrap",
            }}
          >
            {["Built for agency owners", "Replaces 4–5 tools", "£0 until your first deal"].map((stat, i) => (
              <span key={stat} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && (
                  <span style={{ width: 1, height: 20, background: gold + "40", margin: "0 20px" }} />
                )}
                <span style={{ fontSize: 12, color: "#666462", fontWeight: 500 }}>{stat}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <section
        style={{
          background: surface,
          padding: "80px 24px",
          borderTop: `0.5px solid ${border}`,
          borderBottom: `0.5px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 52,
              maxWidth: 600,
            }}
          >
            Outreach is broken.
            <br />Everyone knows it.
          </h2>

          <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                title: "Apollo gives you a database",
                body: "Names and emails from 2022. You still have to research every business yourself, write every message yourself, figure out what to say yourself.\n\nYou're paying for a phonebook.",
              },
              {
                title: "Clay enriches your data",
                body: "More fields in your spreadsheet. But who writes the message? Who knows what's broken in their business? Who tells you who to contact first?\n\nStill you.",
              },
              {
                title: "Templates get ignored",
                body: "Prospects have seen every variation of every cold email. The moment it feels like a template it gets deleted.\n\nPersonalisation at scale doesn't exist.\n\nUntil now.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                style={{
                  background: bg,
                  borderLeft: `2px solid ${gold}`,
                  padding: "24px 24px 24px 22px",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 600, color: ivory, marginBottom: 12 }}>{title}</p>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.75, whiteSpace: "pre-line" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: bg }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p style={{ fontSize: 10, color: gold, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 16 }}>
            How Venn Works
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 72,
            }}
          >
            Intelligence first.
            <br />Outreach second.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                num: "01",
                title: "Finds real businesses that need you",
                body: "Tell Venn a niche and location. It searches in real time, finds live businesses and pulls their Google Reviews, website data and social signals.\n\nNo database. No stale contacts. Every result exists right now.",
                visual: <MockSearch />,
              },
              {
                num: "02",
                title: "Scores their intent automatically",
                body: "Venn analyses every signal and scores each business High, Medium or Low intent. High intent means something is broken and they need help. You know who to contact first before you've read a single review.",
                visual: <MockLeads />,
              },
              {
                num: "03",
                title: "Writes your opening line from real signals",
                body: "Every opening line is generated from real data about that specific business. Not a template with their name inserted. A line that references something specific and real. The kind of line only a human who did their homework would write.",
                visual: <MockTyping />,
              },
              {
                num: "04",
                title: "Sends a card they can't ignore",
                body: "Generate a Digital Prospect Card — a unique URL that shows their own business data back at them. Their reviews. Their pain points. Their estimated revenue loss. One human CTA.\n\nTwelve words. Their URL. That's your outreach.",
                visual: <MockPhone />,
              },
            ].map(({ num, title, body, visual }, i) => (
              <div
                key={num}
                className="step-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1fr" : "1fr 1fr",
                  gap: 60,
                  alignItems: "center",
                  padding: "52px 0",
                  borderBottom: i < 3 ? `0.5px solid ${border}` : "none",
                  flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: `0.5px solid ${gold}60`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 11, color: gold, fontWeight: 700, letterSpacing: "0.05em" }}>{num}</span>
                    </div>
                    <h3 style={{ fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 600, color: ivory, lineHeight: 1.3 }}>
                      {title}
                    </h3>
                  </div>
                  <p style={{ fontSize: 15, color: muted, lineHeight: 1.75, maxWidth: 480, whiteSpace: "pre-line" }}>
                    {body}
                  </p>
                </div>
                <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
                  {visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROSPECT CARD ────────────────────────────────────────────────── */}
      <section
        style={{
          background: surface,
          padding: "100px 24px",
          borderTop: `0.5px solid ${border}`,
          borderBottom: `0.5px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p style={{ fontSize: 10, color: gold, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 500, marginBottom: 16 }}>
            The Digital Prospect Card
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            The outreach format
            <br />that cannot be saturated.
          </h2>

          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: muted, maxWidth: 600, lineHeight: 1.75, marginBottom: 60 }}>
            Every card is built from real intelligence about that specific business. Their Google rating. Their specific review complaints. Their broken booking link. Their estimated monthly revenue loss calculated from their signals.
            <br /><br />
            You cannot fake this level of specificity with a template. Neither can anyone else.
            <br /><br />
            The closest alternative costs $750 per month and requires the prospect to already be in a deal. Venn generates it automatically for cold outreach at a fraction of the price.
          </p>

          <div className="card-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Sender view */}
            <div>
              <p style={{ fontSize: 11, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 500 }}>
                What you see
              </p>
              <div
                style={{
                  background: bg,
                  border: `0.5px solid ${border}`,
                  borderRadius: 10,
                  padding: 24,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <span style={{ fontSize: 14, color: ivory, fontWeight: 500 }}>Smith & Sons Plumbing</span>
                  <span style={{ fontSize: 9, background: gold, color: bg, fontWeight: 700, padding: "2px 7px", borderRadius: 10, letterSpacing: "0.08em" }}>HOT</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Card views", value: "7" },
                    { label: "Last opened", value: "2h ago" },
                    { label: "Intent", value: "High" },
                    { label: "Status", value: "Warm" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: surface, borderRadius: 6, padding: "10px 12px" }}>
                      <p style={{ fontSize: 10, color: "#444", marginBottom: 2 }}>{label}</p>
                      <p style={{ fontSize: 14, color: label === "Intent" ? gold : ivory, fontWeight: 500 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prospect view */}
            <div>
              <p style={{ fontSize: 11, color: "#555250", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16, fontWeight: 500 }}>
                What they see
              </p>
              <MockCardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ───────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: bg }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 52,
            }}
          >
            One tool.
            <br />Four replaced.
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `0.5px solid ${border}` }}>
                  <th style={{ textAlign: "left", padding: "12px 0", color: "#444", fontWeight: 500, minWidth: 200 }}>Feature</th>
                  {["Apollo", "Clay", "Venn"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 20px",
                        color: col === "Venn" ? gold : "#444",
                        fontWeight: col === "Venn" ? 700 : 500,
                        textAlign: "center",
                        minWidth: 100,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Real-time business search", "✗", "✗", "✓"],
                  ["Review sentiment analysis", "✗", "✗", "✓"],
                  ["Website audit", "✗", "partial", "✓"],
                  ["Intent scoring", "✗", "✗", "✓"],
                  ["Personalised opening line", "✗", "✗", "✓"],
                  ["Digital Prospect Card", "✗", "✗", "✓"],
                  ["Multi-channel sequences", "basic", "✗", "✓"],
                  ["Built for agency owners", "✗", "✗", "✓"],
                  ["Price", "£99+/mo", "£149+/mo", "from £149/mo"],
                ].map(([feat, apollo, clay, venn]) => (
                  <tr key={feat as string} style={{ borderBottom: `0.5px solid ${border}` }}>
                    <td style={{ padding: "14px 0", color: "#888", fontSize: 13 }}>{feat}</td>
                    {[apollo, clay].map((val, i) => (
                      <td
                        key={i}
                        style={{
                          padding: "14px 20px",
                          textAlign: "center",
                          color: val === "✗" ? "#333" : "#555",
                          fontSize: 13,
                        }}
                      >
                        {val}
                      </td>
                    ))}
                    <td
                      style={{
                        padding: "14px 20px",
                        textAlign: "center",
                        color: gold,
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {venn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 12, color: gold, marginTop: 24, lineHeight: 1.6 }}>
            Apollo charges credits whether or not you get results.
            Venn charges nothing until you close your first deal.
          </p>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        style={{
          background: surface,
          padding: "100px 24px",
          borderTop: `0.5px solid ${border}`,
          borderBottom: `0.5px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Pricing that makes sense.
          </h2>
          <p style={{ fontSize: 16, color: muted, textAlign: "center", marginBottom: 56, lineHeight: 1.6 }}>
            No credits. No artificial limits. No paying for data that doesn&apos;t exist.
          </p>

          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {[
              {
                name: "Solopreneur",
                price: "£0",
                sub: "to start",
                desc: "Pay nothing until you close your first client through Venn.",
                features: ["100 leads per month", "20 prospect cards", "Full sequences", "60-day window", "Application required"],
                cta: "Apply now →",
                href: "/solopreneur",
                outline: true,
                note: "We review every application personally",
              },
              {
                name: "Starter",
                price: "£149",
                sub: "/month",
                desc: "Find and qualify leads automatically.",
                features: ["150 leads per month", "10 prospect cards", "Intelligence profiles", "Opening line generation", "CRM pipeline"],
                cta: "Start with Starter",
                href: "/subscribe",
                gold: true,
              },
              {
                name: "Growth",
                price: "£299",
                sub: "/month",
                desc: "Everything in Starter plus unlimited cards and sequences.",
                features: ["400 leads per month", "Unlimited prospect cards", "Multi-channel sequences", "Channel sorting", "Card analytics"],
                cta: "Start with Growth",
                href: "/subscribe",
                gold: true,
                popular: true,
              },
              {
                name: "Pro",
                price: "£499",
                sub: "/month",
                desc: "The complete Prospect Engine. All modules.",
                features: ["Unlimited leads", "Unlimited cards", "Everything in Growth", "Proposal builder", "White-label dashboard"],
                cta: "Go Pro",
                href: "/subscribe",
                gold: true,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                style={{
                  background: plan.popular ? bg : bg,
                  border: plan.popular ? `0.5px solid ${gold}40` : `0.5px solid ${border}`,
                  borderRadius: 10,
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {plan.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: gold,
                      color: bg,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "3px 12px",
                      borderRadius: "0 0 7px 7px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: 18, marginTop: plan.popular ? 8 : 0 }}>
                  <p style={{ fontSize: 10, color: plan.outline ? gold : "#555250", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 8 }}>
                    {plan.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 30, fontFamily: serif, color: ivory, fontWeight: 400, lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: "#444" }}>{plan.sub}</span>
                  </div>
                  <p style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{plan.desc}</p>
                </div>

                <ul style={{ flex: 1, listStyle: "none", padding: 0, marginBottom: 20 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ fontSize: 12, color: "#888", paddingBottom: 7, display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: gold, fontSize: 10, flexShrink: 0, marginTop: 2 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "10px 16px",
                    borderRadius: 7,
                    border: plan.outline ? `0.5px solid ${gold}60` : "none",
                    background: plan.gold ? (plan.popular ? gold : "#1A1814") : `${gold}15`,
                    color: plan.popular ? bg : plan.gold ? ivory : gold,
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                  }}
                >
                  {plan.cta}
                </Link>

                {plan.note && (
                  <p style={{ fontSize: 10, color: "#444", textAlign: "center", marginTop: 10 }}>{plan.note}</p>
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "#444", textAlign: "center", marginTop: 28 }}>
            All plans include a 14-day money back guarantee. No questions asked.
          </p>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", background: bg }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 56,
            }}
          >
            Built by someone who
            <br />needed it.
          </h2>

          <div className="founder-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 72, alignItems: "start" }}>
            {/* Founder note */}
            <div>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.9 }}>
                I built Venn because I needed it.
                <br /><br />
                I was trying to sell Lumio — my AI automation platform for aesthetic clinics — and every outreach tool I tried either returned empty databases, charged me for contacts that didn&apos;t exist, or gave me templates that got ignored.
                <br /><br />
                So I built something different. A tool that thinks before it speaks. That researches the business before writing the message. That generates an outreach format the prospect has never seen before.
                <br /><br />
                I use Venn every day to sell my own software. Every feature exists because I needed it. Every problem it solves is one I felt firsthand.
              </p>
              <p style={{ fontSize: 15, color: ivory, marginTop: 24, fontWeight: 500 }}>— Luke, Founder</p>
            </div>

            {/* Founder image placeholder */}
            <div
              style={{
                background: surface,
                border: `0.5px solid ${border}`,
                borderRadius: 10,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 320,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "#1A1206",
                  border: `0.5px solid #3A2A10`,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <span style={{ color: gold, fontFamily: serif, fontSize: 28, fontWeight: 700 }}>V</span>
              </div>
              <p style={{ fontSize: 12, color: "#333230" }}>Founder photo coming soon</p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="testimonial-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                quote: "Finally a tool that tells me what to say not just who to contact. The opening lines alone are worth the subscription.",
                author: "Agency owner, Manchester",
              },
              {
                quote: "Sent my first prospect card on Monday. By Wednesday they'd replied. Never had that with cold email.",
                author: "Freelance consultant, London",
              },
              {
                quote: "The intelligence profiles changed how I think about outreach. I know more about a prospect in two minutes than I used to know after an hour of research.",
                author: "Digital agency, Birmingham",
              },
            ].map(({ quote, author }) => (
              <div
                key={author}
                style={{
                  background: surface,
                  border: `0.5px solid ${border}`,
                  borderRadius: 10,
                  padding: 24,
                }}
              >
                <p style={{ fontSize: 14, color: ivory, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <p style={{ fontSize: 12, color: "#555250" }}>— {author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        style={{
          background: surface,
          padding: "100px 24px",
          borderTop: `0.5px solid ${border}`,
          borderBottom: `0.5px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.15,
              marginBottom: 56,
            }}
          >
            Questions.
          </h2>
          <FAQAccordion />
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          position: "relative",
          background: bg,
        }}
      >
        {/* Venn diagram */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <svg width="700" height="700" viewBox="0 0 700 700" style={{ opacity: 0.04, animation: "slowSpin 90s linear infinite reverse" }}>
            <circle cx="270" cy="350" r="220" fill="none" stroke={gold} strokeWidth="1" />
            <circle cx="430" cy="350" r="220" fill="none" stroke={gold} strokeWidth="1" />
            <circle cx="350" cy="240" r="220" fill="none" stroke={gold} strokeWidth="1" />
          </svg>
        </div>

        <div style={{ position: "relative", maxWidth: 680 }}>
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              fontFamily: serif,
              fontWeight: 400,
              lineHeight: 1.08,
              marginBottom: 20,
            }}
          >
            Your next client is
            <br />already out there.
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: muted, lineHeight: 1.7, marginBottom: 40 }}>
            Venn knows who they are, what&apos;s broken in their business
            <br />and exactly what to say.
            <br /><br />
            Start finding them today.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/sign-up"
              style={{
                padding: "16px 32px",
                borderRadius: 8,
                background: gold,
                color: bg,
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Start free — no card needed
            </Link>
            <Link
              href="/solopreneur"
              style={{
                padding: "16px 32px",
                borderRadius: 8,
                border: `0.5px solid #3A3632`,
                color: ivory,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Apply for solopreneur access
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: surface,
          borderTop: `0.5px solid ${border}`,
          padding: "56px 24px 32px",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 40, marginBottom: 48 }}>
            {[
              {
                heading: "Product",
                links: [
                  { label: "Features", href: "#how-it-works" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Solopreneur", href: "/solopreneur" },
                  { label: "Sign up", href: "/sign-up" },
                ],
              },
              {
                heading: "Compare",
                links: [
                  { label: "vs Apollo", href: "#" },
                  { label: "vs Clay", href: "#" },
                  { label: "vs GetAccept", href: "#" },
                ],
              },
              {
                heading: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Contact", href: "mailto:luke@venn.so" },
                  { label: "Blog", href: "#" },
                ],
              },
              {
                heading: "Legal",
                links: [
                  { label: "Privacy", href: "#" },
                  { label: "Terms", href: "#" },
                ],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p style={{ fontSize: 11, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500, marginBottom: 16 }}>
                  {heading}
                </p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {links.map(({ label, href }) => (
                    <li key={label} style={{ marginBottom: 10 }}>
                      <a
                        href={href}
                        style={{ fontSize: 13, color: "#555250", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#555250")}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: `0.5px solid ${border}`,
              paddingTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p style={{ fontSize: 12, color: "#333230" }}>© 2025 Venn. All rights reserved.</p>
            <p style={{ fontSize: 12, color: "#333230" }}>Built with soul. Priced fairly. No extraction.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .problem-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .founder-cols { grid-template-columns: 1fr !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .card-cols { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .step-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Mock UI components ────────────────────────────────────────────────── */

function MockSearch() {
  return (
    <div
      style={{
        background: surface,
        border: `0.5px solid ${border}`,
        borderRadius: 10,
        padding: 20,
        fontFamily: sans,
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, background: "#0A0907", border: `0.5px solid ${border}`, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#666" }}>
          Aesthetic clinic
        </div>
        <div style={{ flex: 1, background: "#0A0907", border: `0.5px solid ${border}`, borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#666" }}>
          Manchester
        </div>
        <div style={{ background: gold, borderRadius: 6, padding: "9px 14px", fontSize: 12, fontWeight: 700, color: "#0A0907" }}>
          Search
        </div>
      </div>
      {[
        { name: "The Luxe Clinic", rating: "3.8 ★", intent: "HIGH" },
        { name: "Glow Aesthetics", rating: "4.6 ★", intent: "MED" },
        { name: "Pure Beauty MCR", rating: "4.1 ★", intent: "HIGH" },
      ].map(({ name, rating, intent }) => (
        <div
          key={name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: `0.5px solid ${border}`,
          }}
        >
          <div>
            <p style={{ fontSize: 13, color: ivory, marginBottom: 2 }}>{name}</p>
            <p style={{ fontSize: 11, color: "#555" }}>{rating}</p>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "2px 7px",
              borderRadius: 4,
              background: intent === "HIGH" ? "#C4973F20" : "#1E1C18",
              color: intent === "HIGH" ? gold : "#555",
            }}
          >
            {intent}
          </span>
        </div>
      ))}
    </div>
  );
}

function MockLeads() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: sans }}>
      {[
        { name: "The Luxe Clinic", score: "High", reviews: "3.8 ★ — 47 reviews", borderColor: "#C4973F" },
        { name: "Glow Aesthetics", score: "Medium", reviews: "4.6 ★ — 112 reviews", borderColor: "#4A7C59" },
        { name: "NovaSkin Studio", score: "Low", reviews: "4.9 ★ — 203 reviews", borderColor: "#333" },
      ].map(({ name, score, reviews, borderColor }) => (
        <div
          key={name}
          style={{
            background: surface,
            borderLeft: `3px solid ${borderColor}`,
            borderRadius: "0 8px 8px 0",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p style={{ fontSize: 13, color: ivory, fontWeight: 500, marginBottom: 3 }}>{name}</p>
            <p style={{ fontSize: 11, color: "#555" }}>{reviews}</p>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: score === "High" ? gold : score === "Medium" ? "#4A7C59" : "#444",
            }}
          >
            {score}
          </span>
        </div>
      ))}
    </div>
  );
}

function MockTyping() {
  return (
    <div
      style={{
        background: surface,
        border: `0.5px solid ${border}`,
        borderRadius: 10,
        padding: 24,
        fontFamily: sans,
      }}
    >
      <p style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
        Opening line — The Luxe Clinic
      </p>
      <p style={{ fontSize: 15, color: ivory, lineHeight: 1.7 }}>
        &ldquo;Noticed your last 8 Google reviews mention wait times — one commenter said they almost left. That's bookings you can&apos;t get back.&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14 }}>
        <div style={{ width: 2, height: 16, background: gold, animation: "blink 1s step-end infinite" }} />
        <span style={{ fontSize: 11, color: "#444" }}>Generated from 47 real reviews</span>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

function MockPhone() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 260,
          background: "#0A0907",
          border: `2px solid #2A2826`,
          borderRadius: 28,
          padding: "20px 16px",
          fontFamily: sans,
          position: "relative",
        }}
      >
        {/* Phone notch */}
        <div style={{ width: 60, height: 6, background: "#1A1814", borderRadius: 3, margin: "0 auto 20px" }} />

        <div style={{ background: "#131110", borderRadius: 14, padding: 14 }}>
          <p style={{ fontSize: 10, color: gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Intelligence Brief
          </p>
          <p style={{ fontSize: 15, color: ivory, fontFamily: serif, fontWeight: 400, marginBottom: 4 }}>
            The Luxe Clinic
          </p>
          <p style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>Manchester · Aesthetics</p>

          {[
            ["Google rating", "3.8 ★"],
            ["Est. revenue loss", "£4,200/mo"],
            ["Main complaint", "Long wait times"],
          ].map(([label, value]) => (
            <div key={label as string} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `0.5px solid #1E1C18` }}>
              <span style={{ fontSize: 10, color: "#555" }}>{label}</span>
              <span style={{ fontSize: 10, color: "#888" }}>{value}</span>
            </div>
          ))}

          <button
            style={{
              marginTop: 14,
              width: "100%",
              padding: "10px",
              background: gold,
              color: "#0A0907",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
            }}
          >
            Reply to this →
          </button>
        </div>
      </div>
    </div>
  );
}

function MockCardPreview() {
  return (
    <div
      style={{
        background: "#131110",
        border: `0.5px solid ${border}`,
        borderRadius: 10,
        padding: "24px 20px",
        fontFamily: sans,
      }}
    >
      <p style={{ fontSize: 10, color: gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
        Intelligence Brief · venn.so/c/abc123
      </p>
      <h3 style={{ fontSize: 20, fontFamily: serif, color: ivory, fontWeight: 400, marginBottom: 4 }}>
        Smith & Sons Plumbing
      </h3>
      <p style={{ fontSize: 12, color: "#555", marginBottom: 20 }}>
        Birmingham · Plumbing Services
      </p>

      <div style={{ background: bg, borderRadius: 8, padding: 14, marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: "#444", marginBottom: 6 }}>What we found</p>
        <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
          14 of your last 20 reviews mention slow response time. That&apos;s a booking funnel problem, not a service problem.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 20, fontFamily: serif, color: ivory }}>4.1</p>
          <p style={{ fontSize: 10, color: "#444" }}>Google rating</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 20, fontFamily: serif, color: gold }}>£3,800</p>
          <p style={{ fontSize: 10, color: "#444" }}>Est. monthly loss</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 20, fontFamily: serif, color: ivory }}>87</p>
          <p style={{ fontSize: 10, color: "#444" }}>Reviews</p>
        </div>
      </div>

      <button
        style={{
          width: "100%",
          padding: "12px",
          background: gold,
          color: bg,
          fontSize: 13,
          fontWeight: 700,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        Reply to see how →
      </button>
    </div>
  );
}
