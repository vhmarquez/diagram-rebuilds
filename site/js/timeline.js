import { fitStage, loadJson, setStyles, siteUrl, waitForFonts } from "./common.js?v=2";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 4500;
const TIMELINE_BAR_CENTER = 652;
const dateMarkers = new Map([
  ["5c3509e136b9e", "1992"],
  ["5bf45d0769570", "2025"],
]);
const dateMarkerTextIds = new Set(["5c3509e136b9d", "5c1a77ae625a8"]);
const stage = document.querySelector("#timeline-stage");

function weightForGuid(guid) {
  if (guid?.includes("67871a57")) return 700;
  if (guid?.includes("3da741ab")) return 300;
  return 400;
}

function spanStyles(span = {}) {
  return {
    color: span.fontColor,
    fontSize: span.fontSize,
    fontWeight: weightForGuid(span.variantGuid),
    letterSpacing: typeof span.letterSpacing === "number" ? `${span.letterSpacing}px` : undefined,
    textDecoration: span.underline ? "underline" : undefined,
  };
}

function positionStyles(component) {
  const border = Array.isArray(component.border) ? undefined : component.border;
  const isLeftTimelineConnector = component.type === "shape-component"
    && component.height === 5
    && component.width === 103
    && component.x < TIMELINE_BAR_CENTER;
  return {
    position: "absolute",
    left: isLeftTimelineConnector ? 540 : component.x || 0,
    top: component.y || 0,
    width: isLeftTimelineConnector ? 107 : component.width ?? undefined,
    height: component.height ?? undefined,
    opacity: component.opacity ?? 1,
    zIndex: isLeftTimelineConnector ? 1 : component.type === "group" ? 3 : undefined,
    transform: component.rotation ? `rotate(${component.rotation}deg)` : undefined,
    transformOrigin: "center",
    borderRadius: border?.radius || 0,
  };
}

function renderText(component, element) {
  const text = component.textContent || "";
  const overrides = component.textSpans || [];
  const boundaries = new Set([0, text.length]);
  overrides.forEach((span) => {
    const start = span.index || 0;
    boundaries.add(start);
    boundaries.add(Math.min(text.length, start + (span.length || 0)));
  });
  const points = [...boundaries].sort((left, right) => left - right);
  points.slice(0, -1).forEach((start, index) => {
    const end = points[index + 1];
    const active = overrides.filter((span) => {
      const spanStart = span.index || 0;
      return start >= spanStart && start < spanStart + (span.length || 0);
    });
    const run = document.createElement("span");
    run.textContent = text.slice(start, end);
    setStyles(run, spanStyles(Object.assign({}, component.defaultSpan, ...active)));
    element.append(run);
  });
}

function renderNode(item, data, assetPaths) {
  const component = data.components[item.id];
  if (!component || component.visible === false || component.type === "hotspot-component") {
    return null;
  }

  const children = [...(item.items || [])].reverse().map((child) =>
    renderNode(child, data, assetPaths),
  ).filter(Boolean);

  if (component.type === "folder") {
    const fragment = document.createDocumentFragment();
    fragment.append(...children);
    return fragment;
  }

  if (component.type === "group") {
    const element = document.createElement("div");
    element.dataset.componentId = component.id;
    setStyles(element, positionStyles(component));
    if (component.animations?.some((animation) => animation.type === "fadeDown")) {
      element.classList.add("fadeDown");
    }
    element.append(...children);
    return element;
  }

  if (component.type === "shape-component") {
    const element = document.createElement("div");
    const background = Array.isArray(component.background) ? undefined : component.background;
    const border = Array.isArray(component.border) ? undefined : component.border;
    element.setAttribute("aria-hidden", "true");
    element.dataset.componentId = component.id;
    setStyles(element, {
      ...positionStyles(component),
      background: background?.color,
      border: border?.width && border.color
        ? `${border.width}px ${border.style || "solid"} ${border.color}`
        : undefined,
    });
    return element;
  }

  if (component.type === "image-component") {
    const markerYear = dateMarkers.get(component.id);
    if (markerYear) {
      const marker = document.createElement("div");
      marker.className = "timelineDateMarker";
      marker.dataset.componentId = component.id;
      marker.textContent = markerYear;
      setStyles(marker, {
        ...positionStyles(component),
        left: TIMELINE_BAR_CENTER - component.width / 2,
        zIndex: 4,
      });
      return marker;
    }

    const source = component.image ? assetPaths.get(component.image) : undefined;
    if (!source) return null;
    const image = document.createElement("img");
    image.alt = component.altText || "";
    image.dataset.componentId = component.id;
    image.decoding = "async";
    image.draggable = false;
    image.loading = "eager";
    image.src = source;
    image.classList.add("fadeDown");
    setStyles(image, { ...positionStyles(component), objectFit: "cover", zIndex: 2 });
    return image;
  }

  if (component.type === "text-component") {
    if (dateMarkerTextIds.has(component.id)) return null;

    const element = document.createElement("div");
    element.dataset.componentId = component.id;
    setStyles(element, {
      ...positionStyles(component),
      fontFamily: '"Aktiv Grotesk", Arial, sans-serif',
      lineHeight: component.leading ? `${component.leading}px` : undefined,
      padding: `${component.paddingTop || 0}px ${component.paddingRight || 0}px ${component.paddingBottom || 0}px ${component.paddingLeft || 0}px`,
      textAlign: component.justify,
      textTransform: component.textTransform,
      whiteSpace: "pre-wrap",
    });
    renderText(component, element);
    return element;
  }

  return null;
}

async function initialize() {
  const [data, runtimeAssets] = await Promise.all([
    loadJson("data/timeline-render.json"),
    loadJson("data/timeline-assets.json"),
  ]);
  const assetPaths = new Map(runtimeAssets.assets.map((asset) => [asset.id, siteUrl(asset.path)]));
  const fontCss = runtimeAssets.fonts.map((font) =>
    `@font-face{font-family:"Aktiv Grotesk";src:url("${siteUrl(font.path)}") format("woff");font-style:normal;font-weight:${font.weight};font-display:swap;}`,
  ).join("");
  const fontStyle = document.createElement("style");
  fontStyle.textContent = fontCss;
  document.head.append(fontStyle);
  await waitForFonts();

  [...data.hierarchy].reverse().forEach((item) => {
    const rendered = renderNode(item, data, assetPaths);
    if (rendered) stage.append(rendered);
  });
  fitStage(stage, STAGE_WIDTH, STAGE_HEIGHT, "--timeline-scale");
  stage.dataset.fontsReady = "true";
}

initialize().catch((error) => {
  console.error(error);
  stage.dataset.fontsReady = "true";
  stage.textContent = "The timeline could not be loaded.";
});
