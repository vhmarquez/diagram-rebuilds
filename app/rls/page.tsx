import type { Metadata } from "next";
import { RlsExperience } from "@/src/experiences/rls/RlsExperience";

export const metadata: Metadata = {
  title: "RLS C&L Band | Ciena",
  description: "Explore Ciena 6500 Reconfigurable Line System C-band and L-band growth.",
};

export default function RlsPage() {
  return <RlsExperience />;
}
