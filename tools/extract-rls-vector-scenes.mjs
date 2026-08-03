import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const experienceDir = path.join(root, "src", "experiences", "rls");
const manifest = JSON.parse(fs.readFileSync(path.join(experienceDir, "ceros-manifest.json"), "utf8"));
const assetManifest = JSON.parse(fs.readFileSync(path.join(experienceDir, "asset-manifest.json"), "utf8"));
const page = manifest.pages[Object.keys(manifest.pages)[0]];
const dictionary = page.layerDictionary;
const hierarchy = page.layerHierarchies.desktop;

const rootIds = {
  base: ["5ed7e2109738b", "5eb1983d953c0", "5eb023beb2ba6"],
  steps: {
    1: ["5eb057c0cd90e"],
    2: ["5eb05ed0bd619", "5eb05df4bd60c", "5ebe864bf4a86"],
    3: ["5eb06b6a27916", "5eb03f15b2cb9", "5ebe88c4f4aa5"],
    4: ["5eb06bcc27921", "5ec2f25f2369b", "5eb06bcd27950", "5ebe89cef4aaf"],
  },
  popups: {
    amplifier: ["5eb192cd20ddf"],
    roadm1: ["5eb16809a5d0b"],
    roadm2: ["5eb196169538c"],
    roadm3: ["5eb1985c953c6"],
    roadm4: ["5eb19d2b9540c"],
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
  if (!node) throw new Error(`Missing RLS hierarchy node ${id}`);
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
  "id", "type", "title", "x", "y", "width", "height", "opacity", "rotation", "visible",
  "background", "backgroundHasBeenSet", "border", "animations", "shape", "path", "isClosedPath",
  "textContent", "textSpans", "defaultSpan", "justify", "leading", "paddingTop", "paddingBottom",
  "paddingLeft", "paddingRight", "showOverflow", "image", "contentType", "flipHorizontal",
  "flipVertical", "preserveAspectRatio", "crop", "shadow", "blendingMode",
]);

const components = {};
for (const id of selectedIds) {
  const source = dictionary[id];
  if (!source) throw new Error(`Missing RLS component ${id}`);
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
  canvasOffsetY: 37,
  scenes,
  components,
  assets,
};

const outputPath = path.join(experienceDir, "vector-scenes.json");
fs.writeFileSync(outputPath, `${JSON.stringify(output)}\n`);
console.log(`Wrote ${path.relative(root, outputPath)} with ${selectedIds.size} vector-scene components.`);
