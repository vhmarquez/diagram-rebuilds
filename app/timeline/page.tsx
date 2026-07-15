import type { Metadata } from "next";
import { TimelineExperience } from "@/src/experiences/timeline/TimelineExperience";

export const metadata: Metadata = {
  title: "About Ciena | Timeline",
  description: "Ciena company milestones from 1992 to 2025.",
};

export default function TimelinePage() {
  return <TimelineExperience />;
}
