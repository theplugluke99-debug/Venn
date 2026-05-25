import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { NamedPain } from "@/components/landing/NamedPain";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { CardExperience } from "@/components/landing/CardExperience";
import { ChannelDelivery } from "@/components/landing/ChannelDelivery";
import { IntelligenceLoop } from "@/components/landing/IntelligenceLoop";
import { ADifferentWay } from "@/components/landing/ADifferentWay";
import { Comparison } from "@/components/landing/Comparison";
import { Pricing } from "@/components/landing/Pricing";
import { Founder } from "@/components/landing/Founder";
import { TheClose } from "@/components/landing/TheClose";
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
        <ChannelDelivery />
        <IntelligenceLoop />
        <ADifferentWay />
        <Comparison />
        <Pricing />
        <Founder />
        <TheClose />
      </main>
      <Footer />
    </>
  );
}
