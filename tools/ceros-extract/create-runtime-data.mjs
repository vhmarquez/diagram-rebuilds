import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , slug] = process.argv;

if (!slug) {
  console.error("Usage: node tools/ceros-extract/create-runtime-data.mjs <slug>");
  process.exit(1);
}

const experienceDir = path.join(process.cwd(), "src", "experiences", slug);
const manifest = JSON.parse(
  await readFile(path.join(experienceDir, "ceros-manifest.json"), "utf8"),
);
const assetManifest = JSON.parse(
  await readFile(path.join(experienceDir, "asset-manifest.json"), "utf8"),
);
const page = Object.values(manifest.pages ?? {})[0];

if (!page) throw new Error(`No Ceros page was found for ${slug}.`);

const componentFields = [
  "id",
  "type",
  "visible",
  "x",
  "y",
  "width",
  "height",
  "opacity",
  "rotation",
  "background",
  "border",
  "animations",
  "image",
  "altText",
  "textContent",
  "textSpans",
  "defaultSpan",
  "justify",
  "leading",
  "textTransform",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
];
const components = Object.fromEntries(
  Object.entries(page.layerDictionary).map(([id, component]) => [
    id,
    Object.fromEntries(
      componentFields
        .filter((field) => component[field] !== undefined)
        .map((field) => [field, component[field]]),
    ),
  ]),
);
const runtimeData = {
  artboard: {
    width: page.width,
    height: page.overHeight,
    scaleHeight: slug === "timeline" ? 4500 : page.height,
  },
  hierarchy: page.layerHierarchies.desktop,
  components,
};
const runtimeAssets = {
  assets: assetManifest.assets.map((asset) => ({
    id: asset.id,
    path: asset.optimizedPath,
  })),
  fonts: assetManifest.fonts.map((font) => ({
    weight: font.weight,
    path: font.optimizedPath,
  })),
};

await Promise.all([
  writeFile(
    path.join(experienceDir, "render-data.json"),
    `${JSON.stringify(runtimeData)}\n`,
  ),
  writeFile(
    path.join(experienceDir, "runtime-assets.json"),
    `${JSON.stringify(runtimeAssets)}\n`,
  ),
]);

console.log(
  JSON.stringify(
    {
      slug,
      components: Object.keys(components).length,
      assets: runtimeAssets.assets.length,
      renderBytes: Buffer.byteLength(JSON.stringify(runtimeData)),
    },
    null,
    2,
  ),
);
