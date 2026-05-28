import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Cookie Policy — Venn" };

const COOKIES = [
  {
    name: "__clerk_*",
    purpose: "Authentication session managed by Clerk. Keeps you logged in and verifies your identity.",
    duration: "Session / 30 days",
  },
  {
    name: "__session",
    purpose: "Maintains your active session so you don't need to log in on every page.",
    duration: "30 days",
  },
  {
    name: "__client_uat",
    purpose: "Clerk user authentication token. Used to verify your account on each request.",
    duration: "Session",
  },
  {
    name: "stripe_*",
    purpose: "Set by Stripe during payment processing. Used to prevent fraud and ensure secure checkout.",
    duration: "Session",
  },
];

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="May 2025"
      breadcrumb="Cookie Policy"
      intro="Cookies are small files stored on your device. This page explains what cookies Venn uses and why. The short version: essential cookies only, nothing tracking you across the web."
    >
      <h2>1. What we use</h2>
      <p>
        Venn uses <strong>essential cookies only</strong>.
      </p>
      <p>
        Essential cookies are necessary for the website to function. They cannot be switched off. They do not track you across other websites. They do not collect information used for advertising.
      </p>
      <p>We do not use:</p>
      <ul>
        <li>Advertising or retargeting cookies</li>
        <li>Social media tracking pixels</li>
        <li>Analytics cookies that identify you personally</li>
        <li>Any third party tracking of any kind</li>
      </ul>

      <h2>2. Cookies we set</h2>
      <p style={{ marginBottom: 24 }}>
        Here is every cookie Venn sets and what it does.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 32 }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.6fr 2.8fr 1fr",
          padding: "10px 16px",
          background: "#141210",
          borderRadius: "8px 8px 0 0",
          gap: 16,
        }}>
          {["Cookie", "Purpose", "Duration"].map((h) => (
            <p key={h} style={{
              fontSize: 11, color: "#C4973F", textTransform: "uppercase",
              letterSpacing: "0.08em", fontFamily: "var(--font-inter)", margin: 0,
            }}>
              {h}
            </p>
          ))}
        </div>

        {COOKIES.map((cookie, i) => (
          <div key={cookie.name} style={{
            display: "grid", gridTemplateColumns: "1.6fr 2.8fr 1fr",
            padding: "14px 16px",
            background: "#0F0E0B",
            borderBottom: i < COOKIES.length - 1 ? "0.5px solid #1A1814" : "none",
            borderRadius: i === COOKIES.length - 1 ? "0 0 8px 8px" : 0,
            gap: 16,
            alignItems: "start",
          }}>
            <p style={{ fontSize: 13, color: "#FFFDF8", fontFamily: "'Fira Code', 'Courier New', monospace", margin: 0, wordBreak: "break-all" }}>
              {cookie.name}
            </p>
            <p style={{ fontSize: 13, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.6, margin: 0 }}>
              {cookie.purpose}
            </p>
            <p style={{ fontSize: 13, color: "#555250", fontFamily: "var(--font-inter)", margin: 0 }}>
              {cookie.duration}
            </p>
          </div>
        ))}
      </div>

      <h2>3. Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Note that disabling essential cookies will prevent Venn from working correctly — you won&apos;t be able to stay logged in.
      </p>
      <p>How to manage cookies in your browser:</p>
      <ul>
        <li><strong>Chrome</strong> — Settings → Privacy and security → Cookies</li>
        <li><strong>Safari</strong> — Preferences → Privacy</li>
        <li><strong>Firefox</strong> — Options → Privacy &amp; Security → Cookies</li>
        <li><strong>Edge</strong> — Settings → Privacy, search and services → Cookies</li>
      </ul>

      <h2>4. Contact</h2>
      <p>
        Questions about cookies: <a href="mailto:hello@getvenn.agency">hello@getvenn.agency</a>
      </p>
    </LegalPage>
  );
}
