import type { Metadata } from "next";
import { Inter, Instrument_Serif, League_Spartan } from "next/font/google";
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

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  title: "Venn — Prospect Engine",
  description: "Intelligent prospect research and outreach for agency owners.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${leagueSpartan.variable} h-full`}>
        <body className="min-h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}
