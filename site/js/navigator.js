import { fitStage } from "./common.js";

const stage = document.querySelector("#navigator-stage");
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

fitStage(stage, 1280, 720, "--navigator-scale");
