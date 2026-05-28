import { SiteNav } from "@/components/marketing/SiteNav";
import { Footer } from "@/components/landing/Footer";

export const metadata = { title: "Terms of Service — Venn" };

const SECTIONS = [
  {
    heading: "What Venn is",
    body: `Venn is a prospect intelligence platform built for agency owners. It researches small businesses from public sources, scores their intent to buy, and helps you send the right message through the right channel at the right time. That's it.`,
  },
  {
    heading: "What you're agreeing to",
    body: `By using Venn, you're agreeing to use it for legitimate business outreach only. That means genuine prospecting — reaching out to businesses you'd actually like to work with, through channels they've made publicly available.\n\nYou agree not to use Venn for spam, harassment, or any activity that would make the recipient feel targeted in a harmful way. Cold outreach done well is respectful and specific. That's the standard we hold ourselves to and the one we expect from you.`,
  },
  {
    heading: "What we provide",
    body: `Venn pulls intelligence from publicly available sources — Google Business profiles, business websites, Companies House, social media profiles, and other open data. We run that through our own analysis layer to surface intent signals and contact data.\n\nWe don't guarantee the accuracy of third-party data. A business might have moved, changed owner, or updated their contact details since we last checked. The intelligence is a starting point, not a source of truth. Always verify before acting on anything sensitive.`,
  },
  {
    heading: "Payment and cancellation",
    body: `Subscriptions are billed monthly. You can cancel anytime — no notice period, no cancellation fee.\n\nIf something goes wrong in your first 14 days, email us at hello@getvenn.agency and we'll sort out a refund. After that, we don't issue refunds for partial months.\n\nWhen you cancel, your pipeline data — leads, cards, clients, proposals — stays intact. You can still log in and export. We don't delete your data on cancellation.`,
  },
  {
    heading: "Acceptable use",
    body: `Venn is for genuine business development. Use it to find and approach businesses you actually want to work with.\n\nDon't use Venn to: spam people, send bulk unsolicited messages at scale, harass individuals, scrape data for resale, or do anything illegal in your jurisdiction.\n\nWe reserve the right to suspend or terminate accounts that breach these terms. If we do, we'll tell you why.`,
  },
  {
    heading: "Our liability",
    body: `We provide the tools and the intelligence. What you do with them is on you.\n\nVenn is not responsible for the outcomes of your outreach — whether that's no replies, a bad meeting, or a deal that doesn't close. We're a research and communication tool, not a guarantee of business results.\n\nWe'll always do our best to keep the service running reliably, but we can't promise 100% uptime and we're not liable for losses caused by downtime.`,
  },
  {
    heading: "Contact",
    body: `Questions about these terms? Email us at hello@getvenn.agency. We're a small team and we read everything.`,
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: "#0A0907", minHeight: "100vh" }}>
      <SiteNav />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "120px 32px 96px" }}>
        <p style={{
          fontSize: 11, color: "#C4973F", textTransform: "uppercase", letterSpacing: "0.12em",
          fontFamily: "var(--font-inter)", marginBottom: 16,
        }}>
          Legal
        </p>

        <h1 style={{
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          fontSize: "clamp(32px, 5vw, 48px)",
          color: "#FFFDF8",
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: 12,
        }}>
          Terms of Service
        </h1>

        <p style={{
          fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)",
          marginBottom: 64,
        }}>
          Last updated May 2025
        </p>

        <div style={{ borderTop: "0.5px solid #1A1814", paddingTop: 48 }}>
          {SECTIONS.map((section, i) => (
            <div
              key={section.heading}
              style={{
                marginBottom: 48,
                paddingBottom: 48,
                borderBottom: i < SECTIONS.length - 1 ? "0.5px solid #141210" : "none",
              }}
            >
              <h2 style={{
                fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
                fontSize: 22,
                color: "#FFFDF8",
                fontWeight: 400,
                marginBottom: 16,
                lineHeight: 1.3,
              }}>
                {i + 1}. {section.heading}
              </h2>
              {section.body.split("\n\n").map((para, j) => (
                <p key={j} style={{
                  fontSize: 15,
                  color: "#888580",
                  fontFamily: "var(--font-inter)",
                  lineHeight: 1.75,
                  marginBottom: j < section.body.split("\n\n").length - 1 ? 16 : 0,
                }}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
