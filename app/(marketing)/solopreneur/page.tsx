import type { Metadata } from "next";
import { SolopreneurApplyPage } from "./SolopreneurApplyPage";

export const metadata: Metadata = {
  title: "Solopreneur Programme — Venn",
  description: "Apply for the Venn Solopreneur Programme. 30 days free. Close a deal, upgrade on your results.",
};

export default function SolopreneurPage() {
  return <SolopreneurApplyPage />;
}
