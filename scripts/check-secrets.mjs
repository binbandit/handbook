#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const failures = [];

function repositoryFiles() {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { cwd: root },
  );

  return output
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .filter((file) => !file.startsWith("node_modules/"));
}

const forbiddenNames = [
  /(^|\/)\.env(?:\.|$)/i,
  /(^|\/)(?:auth|credentials|cookies?)\.json$/i,
  /(^|\/)hosts\.ya?ml$/i,
  /(^|\/)fish_variables$/i,
  /\.(?:pem|p12|pfx|key)$/i,
  /\.(?:sqlite|sqlite3|db)(?:-(?:shm|wal))?$/i,
  /(^|\/)(?:history|sessions?|logs?|cache)(\/|$)/i,
];

const contentRules = [
  {
    name: "private key material",
    pattern: new RegExp(["-----BEGIN ", "(?:RSA |OPENSSH |EC )?PRIVATE KEY-----"].join("")),
  },
  {
    name: "GitHub token",
    pattern: new RegExp(["(?:ghp_", "|github_pat_)[A-Za-z0-9_]{20,}"].join("")),
  },
  {
    name: "OpenAI project key",
    pattern: new RegExp(["sk-", "proj-[A-Za-z0-9_-]{20,}"].join("")),
  },
  {
    name: "Slack token",
    pattern: new RegExp(["xox", "[baprs]-[A-Za-z0-9-]{10,}"].join("")),
  },
  {
    name: "AWS access key",
    pattern: new RegExp(["AK", "IA[0-9A-Z]{16}"].join("")),
  },
  {
    name: "absolute macOS home path",
    pattern: new RegExp(["/Users/", "[A-Za-z0-9._-]+/"].join("")),
  },
  {
    name: "known private work marker",
    pattern: new RegExp(["EP", "Z-|api\\.studio", "\\.genai\\.", "cba"].join(""), "i"),
  },
];

function looksBinary(buffer) {
  const sample = buffer.subarray(0, Math.min(buffer.length, 8000));
  return sample.includes(0);
}

for (const relativePath of repositoryFiles()) {
  if (forbiddenNames.some((pattern) => pattern.test(relativePath))) {
    failures.push(`${relativePath}: forbidden file or state path`);
    continue;
  }

  const absolutePath = path.join(root, relativePath);
  const fileStat = await stat(absolutePath);
  if (!fileStat.isFile() || fileStat.size > 2_000_000) continue;

  const buffer = await readFile(absolutePath);
  if (looksBinary(buffer)) continue;

  const lines = buffer.toString("utf8").split("\n");
  lines.forEach((line, index) => {
    for (const rule of contentRules) {
      if (rule.pattern.test(line)) {
        failures.push(`${relativePath}:${index + 1}: ${rule.name}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error("Public-boundary check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Public-boundary check passed.");
