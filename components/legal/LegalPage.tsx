import Link from "next/link";
import { SiteNav } from "@/components/marketing/SiteNav";
import { Footer } from "@/components/landing/Footer";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  breadcrumb: string;
  intro?: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, breadcrumb, intro, children }: LegalPageProps) {
  return (
    <div style={{ background: "#0A0907", minHeight: "100vh" }}>
      <SiteNav />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "104px 32px 96px" }}>
        {/* Breadcrumb */}
        <p style={{
          fontSize: 12, color: "#444440", fontFamily: "var(--font-inter)",
          marginBottom: 32, display: "flex", alignItems: "center", gap: 6,
        }}>
          <Link href="/" style={{ color: "#444440", textDecoration: "none" }}>
            getvenn.agency
          </Link>
          <span style={{ color: "#2A2826" }}>/</span>
          <span>{breadcrumb}</span>
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-instrument-serif), 'Instrument Serif', Georgia, serif",
          fontSize: "clamp(36px, 6vw, 52px)",
          color: "#FFFDF8",
          fontWeight: 400,
          lineHeight: 1.1,
          marginBottom: 14,
          letterSpacing: "-0.01em",
        }}>
          {title}
        </h1>

        {/* Date */}
        <p style={{
          fontSize: 13, color: "#444440", fontFamily: "var(--font-inter)", marginBottom: 40,
        }}>
          Last updated {lastUpdated}
        </p>

        {/* Gold rule */}
        <div style={{ width: 40, height: 1, background: "#C4973F", marginBottom: 48 }} />

        {/* Intro paragraph */}
        {intro && (
          <p style={{
            fontSize: 16, color: "#888580", fontFamily: "var(--font-inter)",
            lineHeight: 1.8, marginBottom: 56, borderLeft: "2px solid #C4973F20",
            paddingLeft: 20,
          }}>
            {intro}
          </p>
        )}

        {/* Page content */}
        <div className="legal-content">
          {children}
        </div>

        {/* Bottom rule + contact */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: "0.5px solid #1A1814", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "#888580", fontFamily: "var(--font-inter)", lineHeight: 1.7 }}>
            Questions about this page?{" "}
            <a href="mailto:hello@getvenn.agency" style={{ color: "#C4973F", textDecoration: "none" }}>
              hello@getvenn.agency
            </a>
          </p>
        </div>
      </main>

      <Footer />

      <style>{`
        .legal-content h2 {
          font-family: var(--font-instrument-serif), 'Instrument Serif', Georgia, serif;
          font-size: 24px;
          color: #FFFDF8;
          font-weight: 400;
          line-height: 1.3;
          margin-top: 56px;
          margin-bottom: 20px;
          padding-left: 16px;
          border-left: 2px solid #C4973F;
        }
        .legal-content p {
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 16px;
          color: #888580;
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .legal-content p strong {
          color: #FFFDF8;
          font-weight: 500;
        }
        .legal-content ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }
        .legal-content ul li {
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-size: 15px;
          color: #888580;
          line-height: 1.7;
          padding: 4px 0 4px 20px;
          position: relative;
        }
        .legal-content ul li::before {
          content: "·";
          color: #C4973F;
          position: absolute;
          left: 4px;
          font-size: 18px;
          line-height: 1.4;
        }
        .legal-content ul li strong {
          color: #FFFDF8;
          font-weight: 500;
        }
        .legal-content a {
          color: #C4973F;
          text-decoration: none;
        }
        .legal-content a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
