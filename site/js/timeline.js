import { fitStage, loadJson, setStyles, siteUrl, waitForFonts } from "./common.js?v=2";

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 4800;
const TIMELINE_BAR_CENTER = 652;
const MILESTONE_START_Y = 256;
const MILESTONE_SPACING = 250;
const CARD_IMAGE_HEIGHT = 180;
const FINAL_DATE_MARKER_TOP = 4646;
const TIMELINE_BACKGROUND_ID = "5beeed63ef727";
const TIMELINE_LINE_ID = "5beeee21ab8e2";
const dateMarkers = new Map([
  ["5c3509e136b9e", "1992"],
  ["5bf45d0769570", "2025"],
]);
const dateMarkerTextIds = new Set(["5c3509e136b9d", "5c1a77ae625a8"]);
const timelineCards = [
  { imageId: "5beeedb4ab8da", contentId: "5beef41744540" },
  { imageId: "5beeedc4ab8e1", contentId: "5beef2f7ab8f5" },
  { imageId: "5beeedb4ab8dc", contentId: "5beef2ffab8f6" },
  { imageId: "5beeedb4ab8d8", contentId: "5beef307ab8f9" },
  { imageId: "5beeedb4ab8d9", contentId: "5beef31aab8fc" },
  { imageId: "5beeedb4ab8df", contentId: "5beef32dab8ff" },
  { imageId: "5beeedb4ab8dd", contentId: "5beef344ab902" },
  { imageId: "5bf47ff669572", contentId: "5beef34aab905" },
  { imageId: "69a72666fdc6e", contentId: "69a72666fdc6a" },
  { imageId: "5beeedb4ab8de", contentId: "5e0a2ca253f45" },
  { imageId: "5e0a44447cad7", contentId: "5beef35fab90b" },
  { imageId: "5e0a2a7253f3d", contentId: "5e0a40f57cad1" },
  { imageId: "63d167db67d26", contentId: "63d1699d67d27" },
  { imageId: "63d16dd367d2c", contentId: "63d16de567d2d" },
  { imageId: "697907fcd3790", contentId: "697907fcd378c" },
  { imageId: "6763361c099df", contentId: "6763361c099db" },
  { imageId: "69790a74d3796", contentId: "69790a74d3792" },
];
const timelineCardComponentIds = new Set(
  timelineCards.flatMap(({ imageId, contentId }) => [imageId, contentId]),
);
const timelineConnectorIndexes = new Map([
  ["5beef0f0ab8e3", 0],
  ["5beef0fcab8e5", 1],
  ["5beef0f9ab8e4", 2],
  ["5beef115ab8e6", 3],
  ["5beef125ab8e7", 4],
  ["5beef134ab8e8", 5],
  ["5beef151ab8ea", 6],
  ["5beef157ab8eb", 7],
  ["5beef161ab8ec", 8],
  ["5beef16aab8ee", 9],
  ["5e0a2e4653f4a", 10],
  ["63d1679f67d24", 11],
  ["63d16d3567d2b", 12],
  ["63d17ab88af70", 13],
  ["697907fcd3791", 13],
  ["6763361c099e0", 14],
  ["69790a74d379d", 15],
  ["69790a74d3797", 15],
  ["69a7257dfdc69", 16],
]);
const stage = document.querySelector("#timeline-stage");
const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
let platformName = "other";
if (/mac|iphone|ipad|ipod/i.test(platform)) platformName = "macos";
if (/windows|win32|win64/i.test(platform)) platformName = "windows";
stage.dataset.platform = platformName;

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
  const connectorIndex = timelineConnectorIndexes.get(component.id);
  const isTimelineConnector = connectorIndex !== undefined;
  const isLeftTimelineConnector = isTimelineConnector && component.x < TIMELINE_BAR_CENTER;
  return {
    position: "absolute",
    left: isLeftTimelineConnector ? 540 : component.x || 0,
    top: isTimelineConnector
      ? MILESTONE_START_Y + connectorIndex * MILESTONE_SPACING + CARD_IMAGE_HEIGHT / 2
      : component.y || 0,
    width: isLeftTimelineConnector ? 107 : component.width ?? undefined,
    height: component.id === TIMELINE_BACKGROUND_ID
      ? STAGE_HEIGHT - component.y
      : component.id === TIMELINE_LINE_ID
        ? FINAL_DATE_MARKER_TOP + 3 - component.y
        : component.height ?? undefined,
    opacity: component.opacity ?? 1,
    zIndex: isTimelineConnector ? 1 : component.type === "group" ? 3 : undefined,
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

function indexHierarchy(items, index = new Map()) {
  items.forEach((item) => {
    index.set(item.id, item);
    indexHierarchy(item.items || [], index);
  });
  return index;
}

function renderTimelineCard(card, index, data, assetPaths, hierarchyIndex) {
  const imageComponent = data.components[card.imageId];
  const contentComponent = data.components[card.contentId];
  const contentItem = hierarchyIndex.get(card.contentId);
  const source = imageComponent?.image ? assetPaths.get(imageComponent.image) : undefined;
  if (!imageComponent || !contentComponent || !contentItem || !source) return null;

  const textComponents = (contentItem.items || [])
    .map((item) => data.components[item.id])
    .filter((component) => component?.type === "text-component" && component.textContent.trim() !== "TM")
    .sort((left, right) => (left.y || 0) - (right.y || 0));
  const [dateComponent, descriptionComponent] = textComponents;
  if (!dateComponent || !descriptionComponent) return null;

  const cardElement = document.createElement("article");
  const date = dateComponent.textContent.trim();
  cardElement.className = "timelineCard fadeDown";
  cardElement.dataset.componentId = contentComponent.id;
  cardElement.setAttribute("aria-label", date);
  setStyles(cardElement, {
    left: imageComponent.x < TIMELINE_BAR_CENTER ? 235 : 756,
    top: MILESTONE_START_Y + index * MILESTONE_SPACING,
  });

  const image = document.createElement("img");
  image.className = "timelineCardImage";
  image.alt = imageComponent.altText || "";
  image.dataset.componentId = imageComponent.id;
  image.decoding = "async";
  image.draggable = false;
  image.loading = "eager";
  image.src = source;

  const content = document.createElement("div");
  content.className = "timelineCardContent";

  const dateElement = document.createElement("div");
  dateElement.className = "timelineCardDate";
  dateElement.dataset.componentId = dateComponent.id;
  dateElement.textContent = date;

  const description = document.createElement("div");
  description.className = "timelineCardDescription";
  description.dataset.componentId = descriptionComponent.id;
  description.textContent = descriptionComponent.textContent
    .trim()
    .replace(/WaveLogic\s{2,}coherent/, "WaveLogic™ coherent");

  content.append(dateElement, description);
  cardElement.append(image, content);
  return cardElement;
}

function renderNode(item, data, assetPaths) {
  const component = data.components[item.id];
  if (
    !component
    || component.visible === false
    || component.type === "hotspot-component"
    || timelineCardComponentIds.has(component.id)
  ) {
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
        top: markerYear === "1992" ? 244 : FINAL_DATE_MARKER_TOP,
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
  const hierarchyIndex = indexHierarchy(data.hierarchy);
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
  timelineCards.forEach((card, index) => {
    const rendered = renderTimelineCard(card, index, data, assetPaths, hierarchyIndex);
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
