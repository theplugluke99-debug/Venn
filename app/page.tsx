import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { NamedPain } from "@/components/landing/NamedPain";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { CardExperience } from "@/components/landing/CardExperience";
import { Comparison } from "@/components/landing/Comparison";
import { Pricing } from "@/components/landing/Pricing";
import { SocialProof } from "@/components/landing/SocialProof";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Venn — The Prospect Engine for Agency Owners",
  description:
    "Find local businesses, analyse their reviews, score their intent and generate personalised prospect cards automatically. Replaces Apollo, Clay and digital sales rooms.",
  openGraph: {
    title: "Venn — The Prospect Engine for Agency Owners",
    description:
      "Find them. Know what's broken in their business. Say exactly the right thing. Win.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <NamedPain />
        <LiveDemo />
        <CardExperience />
        <Comparison />
        <SocialProof />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
