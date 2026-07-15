import type { Metadata } from "next";
import { NavigatorExperience } from "@/src/experiences/navigator/NavigatorExperience";

export const metadata: Metadata = {
  title: "Navigator Network Control Suite | Ciena",
  description: "Explore Ciena Navigator Network Control Suite products and applications.",
};

export default function NavigatorPage() {
  return <NavigatorExperience />;
}
