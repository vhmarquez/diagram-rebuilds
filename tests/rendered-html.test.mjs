import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

for (const pathname of ["/timeline"]) {
  test(`server-renders the Timeline experience at ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, /<title>About Ciena \| Timeline<\/title>/i);
    assert.match(html, /data-experience="ciena-timeline"/);
    assert.match(html, /Ciena was incorporated and quickly found success/);
    assert.match(html, /Ciena acquired Nubis Communications/);
    assert.match(html, /assets\/optimized\/timeline/);
    assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
  });
}

for (const pathname of ["/", "/navigator"]) {
  test(`server-renders the Navigator experience at ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, /<title>Navigator Network Control Suite \| Ciena<\/title>/i);
    assert.match(html, /data-experience="ciena-navigator"/);
    assert.match(html, /The software provides a single point of control/);
    assert.match(html, /assets\/optimized\/navigator/);
    assert.match(html, /Show Navigator Intelligent Apps/);
    assert.doesNotMatch(html, /view\.ceros\.com|media\.ceros\.com/);
  });
}

test("server-renders the Navigator iframe QA harness", async () => {
  const response = await render("/qa/navigator-iframe");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /title="Navigator experience QA frame"/);
  assert.match(html, /src="\/navigator"/);
  assert.match(html, /width:1265px/);
  assert.match(html, /height:712px/);
});
