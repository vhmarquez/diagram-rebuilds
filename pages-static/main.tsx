import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { withBasePath } from "@/src/shared/withBasePath";
import "@/app/globals.css";
import "./pages.css";

type ExperienceId = "timeline" | "navigator" | "rls" | "liquid-spectrum";

const experienceLoaders: Record<ExperienceId, () => Promise<ComponentType>> = {
  timeline: () =>
    import("@/src/experiences/timeline/TimelineExperience").then(
      (module) => module.TimelineExperience,
    ),
  navigator: () =>
    import("@/src/experiences/navigator/NavigatorExperience").then(
      (module) => module.NavigatorExperience,
    ),
  rls: () =>
    import("@/src/experiences/rls/RlsExperience").then(
      (module) => module.RlsExperience,
    ),
  "liquid-spectrum": () =>
    import("@/src/experiences/liquid-spectrum/LiquidSpectrumExperience").then(
      (module) => module.LiquidSpectrumExperience,
    ),
};

const experienceLinks: Array<{
  id: ExperienceId;
  label: string;
  description: string;
}> = [
  {
    id: "timeline",
    label: "Ciena Timeline",
    description: "Company milestones from 1992 to 2025",
  },
  {
    id: "navigator",
    label: "Navigator",
    description: "Network Control Suite product overview",
  },
  {
    id: "rls",
    label: "RLS C&L Band",
    description: "Reconfigurable Line System growth experience",
  },
  {
    id: "liquid-spectrum",
    label: "Liquid Spectrum",
    description: "Photonic network lifecycle applications",
  },
];

function ExperienceIndex() {
  return (
    <main className="pagesHub">
      <div className="pagesHubContent">
        <p className="pagesEyebrow">Ciena interactive experience rebuilds</p>
        <h1>Choose an experience</h1>
        <p className="pagesIntro">
          Desktop previews of the four rebuilt interactive diagrams.
        </p>
        <nav aria-label="Ciena interactive experiences" className="pagesGrid">
          {experienceLinks.map((experience, index) => (
            <a
              className="pagesCard"
              href={withBasePath(`${experience.id}/`)}
              key={experience.id}
            >
              <span className="pagesCardNumber">0{index + 1}</span>
              <strong>{experience.label}</strong>
              <span>{experience.description}</span>
              <span aria-hidden="true" className="pagesArrow">→</span>
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}

async function renderPage() {
  const selectedExperience = document.body.dataset.experience as
    | ExperienceId
    | undefined;
  const Experience = selectedExperience
    ? await experienceLoaders[selectedExperience]()
    : undefined;

  createRoot(document.getElementById("root")!).render(
    <StrictMode>{Experience ? <Experience /> : <ExperienceIndex />}</StrictMode>,
  );
}

void renderPage();
