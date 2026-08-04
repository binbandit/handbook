#!/usr/bin/env node

import { access, readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const failures = [];
const textExtensions = new Set([
  ".css",
  ".fish",
  ".hbs",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".sh",
  ".toml",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

function repositoryFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root },
  );

  return output.toString("utf8").split("\0").filter(Boolean);
}

const files = repositoryFiles();

for (const relativePath of files) {
  if (!textExtensions.has(path.extname(relativePath))) continue;

  const absolutePath = path.join(root, relativePath);
  const fileStat = await stat(absolutePath);
  if (!fileStat.isFile() || fileStat.size > 2_000_000) continue;

  const content = await readFile(absolutePath, "utf8");
  const emDash = String.fromCodePoint(0x2014);
  if (content.includes(emDash)) {
    failures.push(`${relativePath}: contains an em dash`);
  }

  if (relativePath.endsWith(".md")) {
    const links = content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
    for (const match of links) {
      const target = match[1].trim().replace(/^<|>$/g, "");
      if (
        target.startsWith("http://") ||
        target.startsWith("https://") ||
        target.startsWith("mailto:") ||
        target.startsWith("#")
      ) {
        continue;
      }

      const pathWithoutAnchor = decodeURIComponent(target.split("#")[0]);
      if (!pathWithoutAnchor) continue;

      const linkedPath = path.resolve(path.dirname(absolutePath), pathWithoutAnchor);
      try {
        await access(linkedPath);
      } catch {
        failures.push(`${relativePath}: broken local link to ${target}`);
      }
    }
  }
}

const instructionFiles = ["AGENTS.md", "agents/global/AGENTS.md"];
let combinedInstructionBytes = 0;
for (const instructionFile of instructionFiles) {
  const fileStat = await stat(path.join(root, instructionFile));
  combinedInstructionBytes += fileStat.size;
  if (fileStat.size > 16 * 1024) {
    failures.push(`${instructionFile}: exceeds the 16 KiB project budget`);
  }
}

if (combinedInstructionBytes > 24 * 1024) {
  failures.push("root and global AGENTS.md files exceed the 24 KiB combined budget");
}

const claudeAdapter = await readFile(path.join(root, "CLAUDE.md"), "utf8");
if (claudeAdapter.trim() !== "@AGENTS.md") {
  failures.push("CLAUDE.md: adapter must remain a thin @AGENTS.md import");
}

if (failures.length > 0) {
  console.error("Content check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Content and instruction checks passed.");
