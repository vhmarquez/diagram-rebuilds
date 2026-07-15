import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [, , referencePath, rebuildPath, outputDirectory, label = "comparison"] =
  process.argv;

if (!referencePath || !rebuildPath || !outputDirectory) {
  console.error(
    "Usage: node tools/visual-compare.mjs <reference> <rebuild> <output-dir> [label]",
  );
  process.exit(1);
}

const reference = sharp(referencePath).removeAlpha();
const rebuild = sharp(rebuildPath).removeAlpha();
const referenceMetadata = await reference.metadata();
const rebuildMetadata = await rebuild.metadata();

if (
  referenceMetadata.width !== rebuildMetadata.width ||
  referenceMetadata.height !== rebuildMetadata.height
) {
  throw new Error(
    `Image dimensions differ: ${referenceMetadata.width}x${referenceMetadata.height} vs ${rebuildMetadata.width}x${rebuildMetadata.height}`,
  );
}

const width = referenceMetadata.width;
const height = referenceMetadata.height;
const referenceBuffer = await reference.raw().toBuffer();
const rebuildBuffer = await rebuild.raw().toBuffer();
const differenceBuffer = Buffer.alloc(referenceBuffer.length);
let absoluteDifference = 0;
let channelsOverThreshold = 0;
const threshold = 12;

for (let index = 0; index < referenceBuffer.length; index += 1) {
  const difference = Math.abs(referenceBuffer[index] - rebuildBuffer[index]);
  absoluteDifference += difference;
  if (difference > threshold) channelsOverThreshold += 1;
  differenceBuffer[index] = Math.min(255, difference * 4);
}

await mkdir(outputDirectory, { recursive: true });

const referencePng = await sharp(referenceBuffer, {
  raw: { width, height, channels: 3 },
}).png().toBuffer();
const rebuildPng = await sharp(rebuildBuffer, {
  raw: { width, height, channels: 3 },
}).png().toBuffer();

await sharp({
  create: {
    width: width * 2,
    height,
    channels: 3,
    background: "#ffffff",
  },
})
  .composite([
    { input: referencePng, left: 0, top: 0 },
    { input: rebuildPng, left: width, top: 0 },
  ])
  .png()
  .toFile(path.join(outputDirectory, `${label}-side-by-side.png`));

await sharp(differenceBuffer, { raw: { width, height, channels: 3 } })
  .png()
  .toFile(path.join(outputDirectory, `${label}-difference-amplified.png`));

const metrics = {
  label,
  width,
  height,
  meanAbsoluteChannelDifference: Number(
    (absoluteDifference / referenceBuffer.length).toFixed(3),
  ),
  channelsOverThresholdPercent: Number(
    ((channelsOverThreshold / referenceBuffer.length) * 100).toFixed(3),
  ),
  threshold,
};

await writeFile(
  path.join(outputDirectory, `${label}-metrics.json`),
  `${JSON.stringify(metrics, null, 2)}\n`,
);

console.log(JSON.stringify(metrics));
