import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [, , slug] = process.argv;

if (!slug) {
  console.error("Usage: node tools/ceros-extract/optimize-images.mjs <slug>");
  process.exit(1);
}

const root = process.cwd();
const experienceDir = path.join(root, "src", "experiences", slug);
const optimizedDir = path.join(root, "public", "assets", "optimized", slug);
const manifestPath = path.join(experienceDir, "ceros-manifest.json");
const assetManifestPath = path.join(experienceDir, "asset-manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const assetManifest = JSON.parse(await readFile(assetManifestPath, "utf8"));
const renderWidths = new Map();

for (const page of Object.values(manifest.pages ?? {})) {
  for (const component of Object.values(page.layerDictionary ?? {})) {
    if (component.type !== "image-component" || !component.image) continue;
    renderWidths.set(
      component.image,
      Math.max(renderWidths.get(component.image) ?? 0, component.width ?? 0),
    );
  }
}

await mkdir(optimizedDir, { recursive: true });

let sourceBytes = 0;
let optimizedBytes = 0;

for (const asset of assetManifest.assets) {
  sourceBytes += asset.bytes;
  const renderWidth = renderWidths.get(asset.id);

  const sourcePath = path.join(root, asset.sourcePath);

  if (!renderWidth || (asset.mimetype === "image/png" && asset.bytes < 20_000)) {
    const outputName = path.basename(asset.sourcePath);
    await copyFile(sourcePath, path.join(optimizedDir, outputName));
    asset.optimizedPath = `/assets/optimized/${slug}/${outputName}`;
    asset.optimizedBytes = asset.bytes;
    asset.optimization = "source-copied";
    optimizedBytes += asset.bytes;
    continue;
  }

  const outputName = `${path.basename(asset.sourcePath, path.extname(asset.sourcePath))}.webp`;
  const outputPath = path.join(optimizedDir, outputName);
  const targetWidth = Math.min(asset.width ?? Infinity, Math.ceil(renderWidth * 2));
  const pipeline = sharp(sourcePath).resize({
    width: targetWidth,
    withoutEnlargement: true,
    fit: "inside",
  });
  const bytes = await pipeline.webp({ quality: 84, smartSubsample: true }).toBuffer();
  await writeFile(outputPath, bytes);
  const metadata = await sharp(bytes).metadata();

  asset.optimizedPath = `/assets/optimized/${slug}/${outputName}`;
  asset.optimizedBytes = bytes.length;
  asset.optimizedWidth = metadata.width ?? null;
  asset.optimizedHeight = metadata.height ?? null;
  asset.optimizedSha256 = createHash("sha256").update(bytes).digest("hex");
  asset.optimization = "webp-2x-render-width";
  optimizedBytes += bytes.length;
}

for (const font of assetManifest.fonts) {
  const outputPath = path.join(optimizedDir, font.filename);
  await copyFile(path.join(root, font.sourcePath), outputPath);
  font.optimizedPath = `/assets/optimized/${slug}/${font.filename}`;
}

assetManifest.optimizedAt = new Date().toISOString();
assetManifest.optimization = {
  sourceBytes,
  optimizedBytes,
  reductionPercent: Number(((1 - optimizedBytes / sourceBytes) * 100).toFixed(2)),
};

await writeFile(assetManifestPath, `${JSON.stringify(assetManifest, null, 2)}\n`);

console.log(JSON.stringify(assetManifest.optimization, null, 2));
