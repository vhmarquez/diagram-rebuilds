import { fitStage, waitForFonts } from "./common.js?v=2";

const stage = document.querySelector("#navigator-stage");
const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
stage.dataset.platform = /windows|win32|win64/i.test(platform) ? "windows" : "other";
const panels = [...stage.querySelectorAll("[data-panel]")];
const controls = [...stage.querySelectorAll("[data-state-target]")];

function selectState(state) {
  stage.dataset.activeState = state;
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== state;
  });
  controls.forEach((control) => {
    control.setAttribute("aria-pressed", String(control.dataset.stateTarget === state));
  });
}

controls.forEach((control) => {
  control.addEventListener("click", () => selectState(control.dataset.stateTarget));
});

async function initialize() {
  fitStage(stage, 1280, 720, "--navigator-scale");
  await waitForFonts();
  stage.dataset.fontsReady = "true";
}

initialize().catch((error) => {
  console.error(error);
  stage.dataset.fontsReady = "true";
});
