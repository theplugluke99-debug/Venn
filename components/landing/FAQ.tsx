"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How is this different from Apollo?",
    a: "Apollo is a database. Venn searches in real time and finds businesses that exist right now. Apollo tells you who to contact. Venn tells you who to contact, what's broken in their business, what to say about it, and generates a personalised prospect card automatically. Completely different product.",
  },
  {
    q: "What is a Digital Prospect Card?",
    a: "A unique URL generated automatically for each prospect. They open it and see their own business name, their Google rating, their specific review complaints, their estimated monthly revenue loss and a single human CTA. It feels like a human built it specifically for them — because Venn did.",
  },
  {
    q: "How does the Solopreneur tier work?",
    a: "You apply, we review your application personally and if approved you get full access for 60 days. You pay nothing until you close your first client through Venn. When you do — one month at £149 then £149/month ongoing. No tricks. No credit card until you've seen results.",
  },
  {
    q: "What niches does Venn work for?",
    a: "Any local business with Google Reviews and a website. Aesthetic clinics, dentists, estate agents, gyms, accountants, solicitors, restaurants, car dealerships — any niche where businesses have an online presence.",
  },
  {
    q: "Does Venn send the outreach for me?",
    a: "No — and that's intentional. Venn generates the intelligence, writes the opening line, builds the prospect card and tells you which channel to use and when. You send it. That human touch is what makes it work. Fully automated outreach gets filtered. Human-sent outreach with AI intelligence behind it converts.",
  },
  {
    q: "How accurate is the data?",
    a: "Venn pulls from Google Places API in real time so business data is current. Review analysis is based on the most recent reviews. Website audits run live. It's as accurate as the internet is about that business right now.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your settings page at any time. Your data is preserved for 90 days. If budget is the issue you can pause instead of cancel — one free month, pipeline preserved, come back when you're ready.",
  },
  {
    q: "What if I'm not happy?",
    a: "14-day money back guarantee on all plans. No questions asked. Reply to any email and we'll sort it same day.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        background: "#0F0E0B",
        padding: "120px 24px",
        fontFamily: "var(--font-inter), Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#C4973F",
            textTransform: "uppercase",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Questions
        </p>
        <h2
          style={{
            fontFamily: "var(--font-instrument-serif), Georgia, serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 400,
            color: "#FFFDF8",
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          Answers.
        </h2>

        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: "0.5px solid #1E1C18" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "22px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <span style={{ fontSize: 15, color: "#FFFDF8", fontWeight: 500, lineHeight: 1.4 }}>
                {faq.q}
              </span>
              <span
                style={{
                  color: "#C4973F",
                  flexShrink: 0,
                  fontSize: 20,
                  transition: "transform 0.2s",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  display: "inline-block",
                }}
              >
                +
              </span>
            </button>

            <div
              style={{
                overflow: "hidden",
                maxHeight: open === i ? 400 : 0,
                transition: "max-height 0.3s ease",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "#888580",
                  lineHeight: 1.8,
                  paddingBottom: 22,
                }}
              >
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
