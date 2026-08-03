import type { Metadata } from "next";
import { LiquidSpectrumExperience } from "@/src/experiences/liquid-spectrum/LiquidSpectrumExperience";

export const metadata: Metadata = {
  title: "Liquid Spectrum | Ciena",
  description:
    "Explore Ciena Liquid Spectrum applications across the photonic network lifecycle.",
};

export default function LiquidSpectrumPage() {
  return <LiquidSpectrumExperience />;
}
