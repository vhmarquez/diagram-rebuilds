import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const experienceDir = path.join(root, "src", "experiences", "liquid-spectrum");
const manifest = JSON.parse(
  fs.readFileSync(path.join(experienceDir, "ceros-manifest.json"), "utf8"),
);
const assetManifest = JSON.parse(
  fs.readFileSync(path.join(experienceDir, "asset-manifest.json"), "utf8"),
);
const page = manifest.pages[Object.keys(manifest.pages)[0]];
const dictionary = page.layerDictionary;
const hierarchy = page.layerHierarchies.desktop;

const rootIds = {
  base: ["5f7dd6ead82ea", "5f7e1686d8498", "5f7f0fbe041d5"],
  dimmers: {
    optimization: ["5f91a28b95bcd"],
    operations: ["5f91a28b95bce"],
    delivery: ["5f91a28b95bcf"],
    planning: ["5f91a28b95bd0"],
  },
  phases: {
    liquidSpectrum: ["5f7e1536d848b"],
    optimization: ["5f7e13d3d847a"],
    operations: ["5f7e12ebd846b"],
    delivery: ["5f7e11b1d8456"],
    planning: ["5f7e113ad8455"],
  },
  features: {
    planningToolCalibrator: ["5f7ddfa0d82ee"],
    bandwidthOptimizer: ["5f7de18ed82f6"],
    pinPointOtdr: ["5f7de222d8302"],
    channelMarginGauge: ["5f7de285d830e"],
    photonicPerformanceGauge: ["5f7de33fd831c"],
    liquidRestoration: ["5f7de44fd832b"],
    spectrumDefragmentation: ["65bd4048a8665"],
    snrOptimizer: ["65bd4039a863e"],
  },
};

function findNode(nodes, id) {
  for (const node of nodes ?? []) {
    if (node.id === id) return node;
    const child = findNode(node.items, id);
    if (child) return child;
  }
  return undefined;
}

function requireNode(id) {
  const node = findNode(hierarchy, id);
  if (!node) throw new Error(`Missing Liquid Spectrum hierarchy node ${id}`);
  return node;
}

function collectIds(node, ids) {
  ids.add(node.id);
  for (const child of node.items ?? []) collectIds(child, ids);
}

const scenes = {};
const selectedIds = new Set();
for (const [sceneName, idsOrMap] of Object.entries(rootIds)) {
  if (Array.isArray(idsOrMap)) {
    scenes[sceneName] = idsOrMap.map(requireNode);
    scenes[sceneName].forEach((node) => collectIds(node, selectedIds));
    continue;
  }

  scenes[sceneName] = {};
  for (const [key, ids] of Object.entries(idsOrMap)) {
    scenes[sceneName][key] = ids.map(requireNode);
    scenes[sceneName][key].forEach((node) => collectIds(node, selectedIds));
  }
}

const keepKeys = new Set([
  "id",
  "type",
  "title",
  "x",
  "y",
  "width",
  "height",
  "opacity",
  "rotation",
  "visible",
  "background",
  "backgroundHasBeenSet",
  "border",
  "animations",
  "shape",
  "path",
  "isClosedPath",
  "textContent",
  "textSpans",
  "defaultSpan",
  "textTransform",
  "justify",
  "leading",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "showOverflow",
  "image",
  "contentType",
  "flipHorizontal",
  "flipVertical",
  "preserveAspectRatio",
  "crop",
  "shadow",
  "blendingMode",
]);

const components = {};
for (const id of selectedIds) {
  const source = dictionary[id];
  if (!source) throw new Error(`Missing Liquid Spectrum component ${id}`);
  const compact = {};
  for (const [key, value] of Object.entries(source)) {
    if (keepKeys.has(key) && value !== undefined && value !== null) compact[key] = value;
  }
  components[id] = compact;
}

const assets = Object.fromEntries(
  assetManifest.assets.map((asset) => [asset.id, asset.optimizedPath]),
);

const output = {
  width: page.width,
  height: page.height,
  canvasOffsetY: 0,
  scenes,
  components,
  assets,
};

const outputPath = path.join(experienceDir, "vector-scenes.json");
fs.writeFileSync(outputPath, `${JSON.stringify(output)}\n`);
console.log(
  `Wrote ${path.relative(root, outputPath)} with ${selectedIds.size} vector-scene components.`,
);
