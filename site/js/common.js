const siteRoot = new URL("../", import.meta.url);

export function siteUrl(path) {
  return new URL(String(path).replace(/^\/+/, ""), siteRoot).href;
}

export async function loadJson(path) {
  const response = await fetch(siteUrl(path));
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }
  return response.json();
}

export function fitStage(stage, width, height, cssVariable) {
  const resize = () => {
    const scale = Math.min(window.innerWidth / width, window.innerHeight / height);
    stage.style.setProperty(cssVariable, String(scale));
  };

  resize();
  window.addEventListener("resize", resize);
  return () => window.removeEventListener("resize", resize);
}

export function setStyles(element, styles) {
  for (const [property, value] of Object.entries(styles)) {
    if (value !== undefined && value !== null && value !== "") {
      element.style[property] = typeof value === "number" && !unitless.has(property)
        ? `${value}px`
        : String(value);
    }
  }
}

const unitless = new Set(["fontWeight", "lineHeight", "opacity", "zIndex"]);
