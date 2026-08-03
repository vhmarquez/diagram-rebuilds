import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const outputRoot = join(process.cwd(), "dist-pages");
const routeFiles = [
  "index.html",
  "timeline/index.html",
  "navigator/index.html",
  "rls/index.html",
  "liquid-spectrum/index.html",
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

for (const routeFile of routeFiles) {
  test(`builds GitHub Pages entry ${routeFile}`, async () => {
    const html = await readFile(join(outputRoot, routeFile), "utf8");
    assert.match(html, /\/diagram-rebuilds\/assets\//);
    assert.match(html, /<div id="root"><\/div>/);
  });
}

test("copies the optimized runtime assets", async () => {
  for (const experience of ["timeline", "navigator", "rls", "liquid-spectrum"]) {
    const info = await stat(join(outputRoot, "assets", "optimized", experience));
    assert.equal(info.isDirectory(), true);
  }
});

test("contains no domain-root runtime asset references", async () => {
  const files = (await walk(outputRoot)).filter((file) => /\.(?:css|html|js)$/.test(file));
  for (const file of files) {
    const content = await readFile(file, "utf8");
    assert.doesNotMatch(content, /["'(=]\/assets\/optimized\//, file);
  }
});
