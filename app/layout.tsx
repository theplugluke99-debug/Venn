import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Venn — Prospect Engine",
  description: "Intelligent prospect research and outreach for agency owners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} h-full`}>
        <body className="min-h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}
