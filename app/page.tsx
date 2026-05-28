import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { NamedPain } from "@/components/landing/NamedPain";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { CardExperience } from "@/components/landing/CardExperience";
import { ChannelDelivery } from "@/components/landing/ChannelDelivery";
import { IntelligenceLoop } from "@/components/landing/IntelligenceLoop";
import { CompleteJourney } from "@/components/landing/CompleteJourney";
import { ADifferentWay } from "@/components/landing/ADifferentWay";
import { Comparison } from "@/components/landing/Comparison";
import { Pricing } from "@/components/landing/Pricing";
import { Founder } from "@/components/landing/Founder";
import { TheClose } from "@/components/landing/TheClose";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Venn — The Prospect Engine for Agency Owners",
  description:
    "Find local businesses, analyse their signals, generate personalised prospect cards and close clients without a Zoom call. Built for agency owners who are done with broken outreach.",
  metadataBase: new URL("https://getvenn.agency"),
  openGraph: {
    title: "Venn — The Prospect Engine for Agency Owners",
    description: "Real intelligence. Real attention. Real clients.",
    url: "https://getvenn.agency",
    siteName: "Venn",
    images: [
      {
        url: "https://getvenn.agency/og-image.png",
        width: 1200,
        height: 630,
        alt: "Venn — The Prospect Engine",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venn — The Prospect Engine for Agency Owners",
    description: "Real intelligence. Real attention. Real clients.",
    images: ["https://getvenn.agency/og-image.png"],
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
        <CompleteJourney />
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
