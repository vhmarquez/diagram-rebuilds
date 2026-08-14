import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const requiredPages = [
  "index.html",
  "timeline.html",
  "navigator.html",
  "rls.html",
  "liquid-spectrum.html",
];

async function filesBelow(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesBelow(fullPath));
    else output.push(fullPath);
  }
  return output;
}

function localReferences(source, extension) {
  const references = [];
  if (extension === ".html") {
    for (const match of source.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) references.push(match[1]);
  }
  if (extension === ".css") {
    for (const match of source.matchAll(/url\(["']?([^"')]+)["']?\)/g)) references.push(match[1]);
  }
  if (extension === ".js") {
    for (const match of source.matchAll(/\bfrom\s+["']([^"']+)["']/g)) references.push(match[1]);
  }
  return references.filter((reference) =>
    !/^(?:[a-z]+:|#|\/\/)/i.test(reference) && !reference.startsWith("data:"),
  );
}

test("all four static pages exist without framework entry points", async () => {
  for (const page of requiredPages) await access(path.join(site, page));
  const sourceFiles = await filesBelow(site);
  const source = (await Promise.all(
    sourceFiles
      .filter((file) => [".html", ".css", ".js"].includes(path.extname(file)))
      .map((file) => readFile(file, "utf8")),
  )).join("\n");
  assert.doesNotMatch(source, /\b(?:React|createRoot|vite|vinext|next\/)/i);
});

test("all relative HTML, CSS, and JavaScript references resolve", async () => {
  const sourceFiles = (await filesBelow(site)).filter((file) =>
    [".html", ".css", ".js"].includes(path.extname(file)),
  );
  for (const file of sourceFiles) {
    const source = await readFile(file, "utf8");
    for (const reference of localReferences(source, path.extname(file))) {
      const cleanReference = reference.split(/[?#]/, 1)[0];
      await access(path.resolve(path.dirname(file), cleanReference));
    }
  }
});

test("all scene-data asset references resolve inside the static site", async () => {
  const dataFiles = [
    "data/timeline-assets.json",
    "data/rls-scenes.json",
    "data/liquid-spectrum-scenes.json",
  ];
  for (const relativePath of dataFiles) {
    const data = JSON.parse(await readFile(path.join(site, relativePath), "utf8"));
    const references = Array.isArray(data.assets)
      ? data.assets.map((asset) => asset.path)
      : Object.values(data.assets);
    if (Array.isArray(data.fonts)) {
      references.push(...data.fonts.map((font) => font.path));
    }
    for (const reference of references) {
      await access(path.join(site, reference.replace(/^\/+/, "")));
    }
  }
});
