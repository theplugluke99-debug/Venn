import { SiteNav } from "@/components/marketing/SiteNav";
import { Footer } from "@/components/landing/Footer";

export const metadata = { title: "Privacy Policy — Venn" };

const SECTIONS = [
  {
    heading: "What data we collect about you",
    body: `When you create an account, we collect your name, email address, and profile information through Clerk (our authentication provider).\n\nWhen you use Venn, we store the searches you run, the leads you generate, the prospect cards you create, the clients you manage, and any notes or messages you write inside the platform.\n\nPayments are handled by Stripe, who store your billing details. We see transaction records but never your full card number.\n\nWe use basic usage analytics to understand how the product is being used. This includes page visits and feature usage — nothing more granular than that.`,
  },
  {
    heading: "What data we find about third parties",
    body: `Venn researches businesses on your behalf. To do that, we access publicly available information — Google Business profiles, business websites, Instagram profiles, Companies House records, and other open sources.\n\nWe only store data that is already publicly listed. We don't access private accounts, purchase data from brokers, or store information that isn't publicly accessible.\n\nIf you're a business owner who has found your information in Venn and would like it removed, email us at hello@getvenn.agency and we'll handle it promptly.`,
  },
  {
    heading: "How we use your data",
    body: `To provide the Venn service — that's the main one. Your data is what makes Venn work for you.\n\nTo improve the product. We look at usage patterns in aggregate to understand what's working and what isn't. We don't read your individual conversations or prospect notes.\n\nTo send you product emails — things like onboarding help, feature updates, and occasional tips. Every email has an unsubscribe link and we respect those immediately.`,
  },
  {
    heading: "Who we share data with",
    body: `Clerk handles authentication. Stripe handles payments. Anthropic's API processes your prospect data to generate intelligence reports. Supabase stores your data.\n\nAll of these are established, reputable providers with their own privacy programmes. We share only what each service needs to do its job.\n\nWe do not sell your data. To anyone. Ever. Full stop.`,
  },
  {
    heading: "Your rights",
    body: `You can access all of your data inside Venn at any time. Your leads, cards, clients, proposals, and pipeline are all yours.\n\nYou can delete your account and all associated data — email hello@getvenn.agency and we'll process it within 7 days.\n\nYou can export your pipeline data. We're working on a self-serve export — in the meantime, email us.\n\nVenn is GDPR compliant. If you're based in the EU or UK and have a data request, email hello@getvenn.agency and we'll respond within 30 days.`,
  },
  {
    heading: "Cookies",
    body: `We use essential cookies only — the kind that keep you logged in and make the app function correctly.\n\nNo advertising cookies. No third-party tracking pixels. No retargeting. We don't know where you came from before landing on Venn and we don't try to follow you after you leave.`,
  },
  {
    heading: "Contact",
    body: `Privacy questions, data requests, or anything else — email hello@getvenn.agency.\n\nWe're a small team and we read everything. You'll hear back from a real person.`,
  },
];

export default function PrivacyPage() {
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
          Privacy Policy
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
