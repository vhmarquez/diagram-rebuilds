import { fitStage, loadJson, waitForFonts } from "./common.js?v=2";
import { VectorRenderer } from "./vector-renderer.js?v=2";

const features = {
  planningToolCalibrator: { label: "Planning Tool Calibrator", phase: "planning", previous: "liquidRestoration", next: "bandwidthOptimizer" },
  bandwidthOptimizer: { label: "Bandwidth Optimizer", phase: "delivery", previous: "planningToolCalibrator", next: "pinPointOtdr" },
  pinPointOtdr: { label: "PinPoint OTDR", phase: "operations", previous: "bandwidthOptimizer", next: "channelMarginGauge" },
  channelMarginGauge: { label: "Channel Margin Gauge", phase: "operations", previous: "pinPointOtdr", next: "photonicPerformanceGauge" },
  photonicPerformanceGauge: { label: "Photonic Performance Gauge", phase: "operations", previous: "channelMarginGauge", next: "liquidRestoration" },
  liquidRestoration: { label: "Liquid Restoration", phase: "optimization", previous: "photonicPerformanceGauge", next: "planningToolCalibrator" },
  spectrumDefragmentation: { label: "Spectrum Defragmentation", phase: "optimization", previous: "photonicPerformanceGauge", next: "planningToolCalibrator" },
  snrOptimizer: { label: "SNR Optimizer", phase: "optimization", previous: "photonicPerformanceGauge", next: "planningToolCalibrator" },
};

const phaseLabels = {
  planning: "Planning",
  delivery: "Delivery",
  operations: "Operations",
  optimization: "Optimization",
  liquidSpectrum: "Liquid Spectrum",
};

const stage = document.querySelector("#liquid-stage");
const baseRoot = document.querySelector("#liquid-base-root");
const dimmerRoot = document.querySelector("#liquid-dimmer-root");
const sceneRoot = document.querySelector("#liquid-scene-root");
const featureButtons = [...stage.querySelectorAll("[data-feature-target]")];
const phaseButtons = [...stage.querySelectorAll("[data-phase-target]")];

let renderer;
let vectorData;
let activeFeature = "channelMarginGauge";
let activePhase = null;
let hasUserInteracted = false;
let closing = false;
let transitionLocked = false;
let interactionsReady = false;
let lastTrigger = null;
let closeTimer;
let transitionTimer;

function selectedPhase() {
  return activeFeature ? features[activeFeature].phase : activePhase;
}

function updateControls() {
  const selected = selectedPhase();
  featureButtons.forEach((button) => {
    button.disabled = !interactionsReady || Boolean(activeFeature);
    button.setAttribute("aria-pressed", String(button.dataset.featureTarget === activeFeature));
  });
  phaseButtons.forEach((button) => {
    button.disabled = !interactionsReady || Boolean(activeFeature);
    button.setAttribute("aria-pressed", String(button.dataset.phaseTarget === selected));
  });
}

function lockTransition() {
  clearTimeout(transitionTimer);
  transitionLocked = true;
  transitionTimer = window.setTimeout(() => {
    transitionLocked = false;
    sceneRoot.querySelectorAll(".previousHotspot, .nextHotspot").forEach((button) => {
      button.disabled = closing;
    });
  }, 900);
}

function sceneSection(type, id, label) {
  const section = document.createElement("section");
  section.className = "sceneLayer";
  section.tabIndex = -1;
  section.id = "liquid-active-scene";
  section.setAttribute("aria-labelledby", "liquid-scene-title");
  if (type === "feature") {
    section.dataset.featureScene = id;
    section.setAttribute("aria-modal", "true");
    section.setAttribute("role", "dialog");
  } else {
    section.dataset.phaseScene = id;
  }
  const title = document.createElement("h1");
  title.className = "srOnly";
  title.id = "liquid-scene-title";
  title.textContent = label;
  section.append(title);
  return section;
}

function closeButton(label, className) {
  const button = document.createElement("button");
  button.className = `hotspot ${className}`;
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.addEventListener("click", closeScene);
  return button;
}

function renderScene(focus = false) {
  if (!renderer) return;
  dimmerRoot.replaceChildren();
  sceneRoot.replaceChildren();

  const selected = selectedPhase();
  stage.dataset.activeFeature = activeFeature || "none";
  stage.dataset.activePhase = activePhase || "none";
  stage.dataset.selectedLifecycle = selected || "none";
  stage.dataset.sceneClosing = String(closing);

  if (hasUserInteracted && activeFeature) {
    const nodes = Object.keys(vectorData.scenes.dimmers)
      .filter((phase) => phase !== features[activeFeature].phase)
      .flatMap((phase) => vectorData.scenes.dimmers[phase]);
    dimmerRoot.append(renderer.scene(nodes, {
      className: "vectorDimmer",
      forceTopLevelVisible: true,
      sceneName: `dimmers-except-${features[activeFeature].phase}`,
    }));
  }

  if (activePhase) {
    const section = sceneSection("phase", activePhase, phaseLabels[activePhase] || "Liquid Spectrum");
    section.append(renderer.scene(vectorData.scenes.phases[activePhase], {
      className: "vectorOverlay",
      forceTopLevelVisible: true,
      sceneName: `phase-${activePhase}`,
    }));
    section.append(closeButton("Close lifecycle information", "sceneCloseHotspot"));
    sceneRoot.append(section);
  }

  if (activeFeature) {
    const definition = features[activeFeature];
    const section = sceneSection("feature", activeFeature, definition.label);
    section.append(renderer.scene(vectorData.scenes.features[activeFeature], {
      className: "vectorOverlay",
      forceTopLevelVisible: true,
      sceneName: `feature-${activeFeature}`,
    }));
    section.append(closeButton(`Close ${definition.label}`, "featureCloseHotspot"));

    const previous = document.createElement("button");
    previous.className = "hotspot previousHotspot";
    previous.type = "button";
    previous.disabled = transitionLocked || closing;
    previous.setAttribute("aria-label", `Previous: ${features[definition.previous].label}`);
    previous.addEventListener("click", () => showFeature(definition.previous));
    section.append(previous);

    const next = document.createElement("button");
    next.className = "hotspot nextHotspot";
    next.type = "button";
    next.disabled = transitionLocked || closing;
    next.setAttribute("aria-label", `Next: ${features[definition.next].label}`);
    next.addEventListener("click", () => showFeature(definition.next));
    section.append(next);
    sceneRoot.append(section);
  }

  updateControls();
  if (focus) requestAnimationFrame(() => document.querySelector("#liquid-active-scene")?.focus());
}

function showFeature(feature, trigger = null) {
  if (!interactionsReady || transitionLocked || closing) return;
  if (trigger) lastTrigger = trigger;
  hasUserInteracted = true;
  activePhase = null;
  activeFeature = feature;
  closing = false;
  lockTransition();
  renderScene(true);
}

function showPhase(phase, trigger) {
  if (!interactionsReady || transitionLocked || closing || activeFeature) return;
  lastTrigger = trigger;
  hasUserInteracted = true;
  activeFeature = null;
  activePhase = phase;
  closing = false;
  lockTransition();
  renderScene(true);
}

function closeScene() {
  if ((!activeFeature && !activePhase) || closing) return;
  closing = true;
  stage.dataset.sceneClosing = "true";
  document.querySelector("#liquid-active-scene")?.classList.add("sceneClosing");
  clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    activeFeature = null;
    activePhase = null;
    closing = false;
    renderScene();
    requestAnimationFrame(() => lastTrigger?.focus());
  }, 200);
}

featureButtons.forEach((button) => {
  button.addEventListener("click", () => showFeature(button.dataset.featureTarget, button));
});
phaseButtons.forEach((button) => {
  button.addEventListener("click", () => showPhase(button.dataset.phaseTarget, button));
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeScene();
});

async function initialize() {
  [vectorData] = await Promise.all([
    loadJson("data/liquid-spectrum-scenes.json?v=4"),
    waitForFonts(),
  ]);
  renderer = new VectorRenderer(vectorData, "liquid");
  baseRoot.append(renderer.scene(vectorData.scenes.base, {
    className: "vectorBase",
    sceneName: "base",
  }));
  fitStage(stage, 1280, 720, "--liquid-scale");
  stage.dataset.fontsReady = "true";
  renderScene();
  window.setTimeout(() => {
    interactionsReady = true;
    stage.dataset.interactionsReady = "true";
    updateControls();
  }, 800);
}

initialize().catch((error) => {
  console.error(error);
  stage.dataset.fontsReady = "true";
  stage.textContent = "The Liquid Spectrum experience could not be loaded.";
});
