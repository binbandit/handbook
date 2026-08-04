import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html", host: "localhost" },
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

test("renders the AI operating system homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Bandit(?:'|&#x27;)s Handbook/);
  assert.match(html, /Give AI a better/);
  assert.match(html, /The working loop/);
  assert.match(html, /Instructions/);
  assert.match(html, /Harnesses/);
  assert.match(html, /Agent tools/);
  assert.match(html, /Playbooks/);
  assert.match(html, /Portable by design/);
  assert.match(html, /href="\/start"/);
  assert.match(html, /aria-label="Search the handbook"/);
  assert.match(html, /property="og:image" content="http:\/\/localhost\/og\.png"/);
  assert.match(html, /name="twitter:image" content="http:\/\/localhost\/og\.png"/);
  assert.doesNotMatch(html, /codex-preview|loading skeleton|Starter Project/i);
});

test("ships the bespoke social preview asset", async () => {
  const image = await readFile(new URL("../public/og.png", import.meta.url));
  assert.deepEqual(
    [...image.subarray(0, 8)],
    [137, 80, 78, 71, 13, 10, 26, 10],
  );
  assert.equal(image.readUInt32BE(16), 1731);
  assert.equal(image.readUInt32BE(20), 909);
});

const guideRoutes = [
  ["/start", "Safe portable setup"],
  ["/system", "Source-of-truth rules"],
  ["/harnesses/codex", "Put durable behavior in"],
  ["/harnesses/pi", "Authenticate without publishing secrets"],
  ["/agents/instructions", "Engineering priorities"],
  ["/agents/skills", "Current catalog"],
  ["/agents/delegation", "Keep one integrator"],
  ["/tools/herdr", "Update safely"],
  ["/tools/kite", "Configure the AI connection"],
  ["/tools/axi", "Evaluate without adopting"],
  ["/playbooks/context-to-completion", "Define the finish line"],
  ["/playbooks/verification", "Build an evidence ladder"],
  ["/playbooks/git-with-agents", "Make commits explain outcomes"],
  ["/setup/portable", "What it manages"],
  ["/reference/command-surface", "Prefer visible abbreviations"],
  ["/reference/repository", "Growth rules"],
];

test("renders every canonical guide as full on-site content", async () => {
  for (const [path, canonicalHeading] of guideRoutes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);

    const html = await response.text();
    assert.match(html, /Canonical guide rendered below/, path);
    assert.match(html, new RegExp(canonicalHeading, "i"), path);
    assert.match(html, /aria-label="On this page"/, path);
    assert.match(html, /Maintained source|Canonical guide/, path);
    assert.match(
      html,
      /property="og:image" content="http:\/\/localhost\/og\.png"/,
      path,
    );
  }
});

test("renders a useful not-found page", async () => {
  const response = await render("/trail/that-does-not-exist");
  assert.equal(response.status, 404);

  const html = await response.text();
  assert.match(html, /That trail goes cold/);
  assert.match(html, /Return to the handbook/);
});
