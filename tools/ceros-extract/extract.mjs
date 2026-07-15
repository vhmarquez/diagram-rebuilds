import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , slug, manifestUrl] = process.argv;

if (!slug || !manifestUrl) {
  console.error(
    "Usage: node tools/ceros-extract/extract.mjs <slug> <manifest-url>",
  );
  process.exit(1);
}

const root = process.cwd();
const sourceDir = path.join(root, "assets", "source", slug);
const experienceDir = path.join(root, "src", "experiences", slug);

const sharedFonts = [
  {
    family: "Aktiv Grotesk",
    weight: 300,
    style: "normal",
    filename: "aktiv-grotesk-light.woff",
    url: "https://media-s3-us-east-1.ceros.com/ciena/fonts/2018/11/20/37f91bba-cc19-4576-a304-abb02f322639/aktivgrotesk-lt.woff",
  },
  {
    family: "Aktiv Grotesk",
    weight: 700,
    style: "normal",
    filename: "aktiv-grotesk-bold.woff",
    url: "https://media-s3-us-east-1.ceros.com/ciena/fonts/2018/12/19/e06a162d-a776-4626-96fe-283625698348/aktivgrotesk-bd.woff",
  },
  {
    family: "Aktiv Grotesk",
    weight: 400,
    style: "normal",
    filename: "aktiv-grotesk-regular.woff",
    url: "https://media-s3-us-east-1.ceros.com/ciena/fonts/2019/05/28/6c3ad6d6-d6c4-40ee-b2f9-4b22f3ba3f4b/aktiv-grotesk.woff",
  },
];

function parseJsonp(source) {
  const start = source.indexOf("(");
  const end = source.lastIndexOf(")");

  if (start === -1 || end <= start) {
    throw new Error("The Ceros manifest did not contain a JSONP payload.");
  }

  return JSON.parse(source.slice(start + 1, end));
}

function safeFilename(url, index) {
  const parsed = new URL(url);
  const basename = decodeURIComponent(path.posix.basename(parsed.pathname));
  const cleaned = basename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return cleaned || `asset-${index + 1}`;
}

async function fetchBuffer(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

await mkdir(sourceDir, { recursive: true });
await mkdir(experienceDir, { recursive: true });

const manifestSource = await (await fetch(manifestUrl)).text();
const manifest = parseJsonp(manifestSource);
const pages = Object.entries(manifest.pages ?? {});
const media = pages.flatMap(([pageId, page]) =>
  (page.media ?? []).map((asset) => ({ ...asset, pageId })),
);

const usedNames = new Set();
const assetRecords = [];

for (const [index, asset] of media.entries()) {
  let filename = safeFilename(asset.url, index);
  const extension = path.extname(filename);
  const stem = path.basename(filename, extension);
  let suffix = 2;

  while (usedNames.has(filename)) {
    filename = `${stem}-${suffix}${extension}`;
    suffix += 1;
  }

  usedNames.add(filename);
  const bytes = await fetchBuffer(asset.url);
  await writeFile(path.join(sourceDir, filename), bytes);

  assetRecords.push({
    id: asset.id,
    pageId: asset.pageId,
    sourceUrl: asset.url,
    sourcePath: path.relative(root, path.join(sourceDir, filename)).replaceAll("\\", "/"),
    width: asset.original?.width ?? null,
    height: asset.original?.height ?? null,
    mimetype: asset.mimetype ?? null,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}

const fontRecords = [];

for (const font of sharedFonts) {
  const bytes = await fetchBuffer(font.url);
  await writeFile(path.join(sourceDir, font.filename), bytes);
  fontRecords.push({
    ...font,
    sourcePath: path
      .relative(root, path.join(sourceDir, font.filename))
      .replaceAll("\\", "/"),
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}

const extraction = {
  slug,
  manifestUrl,
  extractedAt: new Date().toISOString(),
  pageIds: pages.map(([pageId]) => pageId),
  assets: assetRecords,
  fonts: fontRecords,
};

await writeFile(
  path.join(experienceDir, "ceros-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(
  path.join(experienceDir, "asset-manifest.json"),
  `${JSON.stringify(extraction, null, 2)}\n`,
);

const totalBytes = [...assetRecords, ...fontRecords].reduce(
  (sum, asset) => sum + asset.bytes,
  0,
);

console.log(
  JSON.stringify(
    {
      slug,
      pages: pages.length,
      assets: assetRecords.length,
      fonts: fontRecords.length,
      totalBytes,
      output: path.relative(root, experienceDir),
    },
    null,
    2,
  ),
);
