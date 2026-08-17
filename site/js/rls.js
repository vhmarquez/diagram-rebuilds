import { fitStage, loadJson, waitForFonts } from "./common.js?v=2";
import { VectorRenderer } from "./vector-renderer.js?v=2";

const steps = {
  1: {
    label: "Initial Installation",
    bullets: [
      "Integrated C&L-band amplifiers are installed at all in-line amplifier sites, so the line system is ready for L-band from day one.",
      "Built-in ASE noise loading ensures stable, optimal performance from day one until the system is fully filled.",
      "L-band ROADM and add/drop can be deferred to lower initial costs.",
    ],
  },
  2: {
    label: "Grow C-band traffic",
    bullets: [
      "Grow C-band capacity by simply adding more wavelengths.",
      "RLS substitutes signal power for ASE during channel addition with no impact to existing in-service traffic.",
    ],
  },
  3: {
    label: "Expand to L-band",
    bullets: [
      "Double fiber capacity with simple, hitless L-band expansion.",
      "No additional planning/engineering required for L-band.",
      "No amplifier site visits required.",
      "No impact to existing in-service C-band traffic.",
    ],
  },
  4: {
    label: "Grow L-band traffic",
    bullets: [
      "RLS substitutes signal power for ASE during channel addition with no impact to existing in-service traffic.",
      "Adding more wavelengths to the L-band is just as easy as adding traffic to the C-band.",
    ],
  },
};

const stepDuration = { 1: 2500, 2: 2600, 3: 3200, 4: 3800 };
const stage = document.querySelector("#rls-stage");
const copyRule = document.querySelector("#rls-copy-rule");
const copy = document.querySelector("#rls-step-copy");
const sceneRoot = document.querySelector("#rls-scene-root");
const stepButtons = [...stage.querySelectorAll("[data-step-target]")];
const productButtons = [...stage.querySelectorAll("[data-product-target]")];

let renderer;
let vectorData;
let step = 1;
let phase = "entering";
let initialStepVisible = false;
let interactionsReady = false;
let productView = null;
let lastTrigger = null;
let stepTimer;
let settleTimer;
let closeTimer;

function renderCopy() {
  const active = steps[step];
  copy.dataset.step = String(step);
  copy.querySelector("h1").textContent = `Step ${step}: ${active.label}`;
  const list = copy.querySelector("ul");
  list.replaceChildren();
  active.bullets.forEach((bullet, index) => {
    const item = document.createElement("li");
    item.textContent = bullet;
    item.style.setProperty("--delay", `${160 + index * 180}ms`);
    list.append(item);
  });
}

function updateControls() {
  stepButtons.forEach((button) => {
    const active = Number(button.dataset.stepTarget) === step;
    button.setAttribute("aria-disabled", String(!interactionsReady));
    button.setAttribute("aria-pressed", String(initialStepVisible && active));
  });
  productButtons.forEach((button) => {
    button.setAttribute("aria-disabled", String(!initialStepVisible));
    button.tabIndex = initialStepVisible ? 0 : -1;
  });
  const roadm = stage.querySelector('[data-product-target="roadm"]');
  roadm.setAttribute("aria-label", `Open ROADM Site product view for Step ${step}`);
}

function renderStepScene() {
  sceneRoot.replaceChildren();
  if (!initialStepVisible || !renderer) return;
  const scene = document.createElement("div");
  scene.className = "scene";
  if (phase === "exiting") scene.classList.add("sceneExiting");
  scene.append(renderer.scene(vectorData.scenes.steps[String(step)], {
    className: "vectorStep",
    sceneName: `step-${step}`,
  }));
  sceneRoot.append(scene);
}

function settle() {
  clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    phase = "settled";
    stage.dataset.motionPhase = phase;
  }, stepDuration[step]);
}

function revealInitialStep() {
  initialStepVisible = true;
  stage.dataset.startupStepVisible = "true";
  copyRule.classList.remove("startupHidden");
  copy.classList.remove("startupHidden");
  copy.setAttribute("aria-hidden", "false");
  renderCopy();
  renderStepScene();
  updateControls();
  settle();
}

function chooseStep(nextStep) {
  if (!interactionsReady || (nextStep === step && phase !== "exiting")) return;
  clearTimeout(stepTimer);
  closeProductView(true);
  phase = "exiting";
  stage.dataset.motionPhase = phase;
  sceneRoot.querySelector(".scene")?.classList.add("sceneExiting");
  stepTimer = window.setTimeout(() => {
    step = nextStep;
    phase = "entering";
    stage.dataset.activeStep = String(step);
    stage.dataset.motionPhase = phase;
    renderCopy();
    renderStepScene();
    updateControls();
    settle();
  }, 200);
}

function openProductView(view, trigger) {
  if (!initialStepVisible || productView) return;
  lastTrigger = trigger;
  productView = view;
  const popup = view === "roadm" ? `roadm${step}` : "amplifier";
  stage.dataset.productView = view;

  const dialog = document.createElement("section");
  dialog.className = "dialogLayer";
  dialog.dataset.motionGranularity = "svg-component";
  dialog.dataset.productPopup = popup;
  dialog.id = "rls-dialog";
  dialog.setAttribute("aria-labelledby", "rls-product-view-title");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("role", "dialog");
  dialog.tabIndex = -1;

  const title = document.createElement("h2");
  title.className = "srOnly";
  title.id = "rls-product-view-title";
  title.textContent = view === "roadm" ? "ROADM Site" : "Bi-directional Amplifier Site";
  dialog.append(title);
  dialog.append(renderer.scene(vectorData.scenes.popups[popup], {
    className: "vectorPopup",
    forceTopLevelVisible: true,
    sceneName: popup,
  }));

  const close = document.createElement("button");
  close.className = `vectorCloseHotspot ${view === "roadm" ? "vectorRoadmClose" : "vectorAmplifierClose"}`;
  close.setAttribute("aria-label", "Close product view");
  close.type = "button";
  close.addEventListener("click", () => closeProductView());
  dialog.append(close);
  stage.append(dialog);
  requestAnimationFrame(() => dialog.focus());
}

function closeProductView(immediate = false) {
  if (!productView) return;
  const dialog = document.querySelector("#rls-dialog");
  clearTimeout(closeTimer);
  const finish = () => {
    dialog?.remove();
    productView = null;
    stage.dataset.productView = "closed";
    if (!immediate) requestAnimationFrame(() => lastTrigger?.focus());
  };
  if (immediate) {
    finish();
  } else {
    dialog?.classList.add("dialogClosing");
    closeTimer = window.setTimeout(finish, 220);
  }
}

stepButtons.forEach((button) => {
  button.addEventListener("click", () => chooseStep(Number(button.dataset.stepTarget)));
});
productButtons.forEach((button) => {
  button.addEventListener("click", () => openProductView(button.dataset.productTarget, button));
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductView();
});

async function initialize() {
  [vectorData] = await Promise.all([
    loadJson("data/rls-scenes.json?v=3"),
    waitForFonts(),
  ]);
  renderer = new VectorRenderer(vectorData, "rls");
  const base = renderer.scene(vectorData.scenes.base, {
    className: "vectorBase",
    sceneName: "base",
  });
  copy.insertAdjacentElement("afterend", base);
  renderCopy();
  fitStage(stage, 1280, 720, "--rls-scale");
  stage.dataset.fontsReady = "true";
  window.setTimeout(revealInitialStep, 5000);
  window.setTimeout(() => {
    interactionsReady = true;
    stage.dataset.stepInteractionsReady = "true";
    updateControls();
  }, 7000);
}

initialize().catch((error) => {
  console.error(error);
  stage.dataset.fontsReady = "true";
  stage.textContent = "The RLS experience could not be loaded.";
});
