import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  readlink,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const linker = path.join(root, "scripts/link-dotfiles.sh");

async function temporaryDirectory(label) {
  return mkdtemp(path.join(os.tmpdir(), `bandits-handbook-${label}-`));
}

function runLinker(home, manifest, mode) {
  return spawnSync(linker, [mode, "--manifest", manifest], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      HOME: home,
      BANDITS_BACKUP_ROOT: path.join(home, ".backups"),
    },
  });
}

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

test("previews, backs up, links, checks, and reapplies idempotently", async () => {
  const fixture = await temporaryDirectory("apply");
  const home = path.join(fixture, "home");
  const manifest = path.join(fixture, "links.tsv");
  const existingTarget = path.join(home, ".config", "test.conf");
  const skillTarget = path.join(home, ".codex", "skills", "plan");

  try {
    await mkdir(path.dirname(existingTarget), { recursive: true });
    await writeFile(existingTarget, "user-owned\n");
    await writeFile(
      manifest,
      [
        "agents/global/AGENTS.md\t~/.config/test.conf",
        "skills/plan\t~/.codex/skills/plan",
        "",
      ].join("\n"),
    );

    const preview = runLinker(home, manifest, "--preview");
    assert.equal(preview.status, 0, preview.stderr);
    assert.match(preview.stdout, /Previewed 2 link change\(s\)/);
    assert.equal(await readFile(existingTarget, "utf8"), "user-owned\n");
    assert.equal(await pathExists(path.join(home, ".backups")), false);

    const apply = runLinker(home, manifest, "--apply");
    assert.equal(apply.status, 0, apply.stderr);
    assert.match(apply.stdout, /Applied 2 link change\(s\)/);
    assert.equal((await lstat(existingTarget)).isSymbolicLink(), true);
    assert.equal(
      await readlink(existingTarget),
      path.join(root, "agents/global/AGENTS.md"),
    );
    assert.equal((await lstat(skillTarget)).isSymbolicLink(), true);

    const backupEntries = await readdir(path.join(home, ".backups"));
    assert.equal(backupEntries.length, 1);
    const preservedTarget = path.join(
      home,
      ".backups",
      backupEntries[0],
      ".config",
      "test.conf",
    );
    assert.equal(await readFile(preservedTarget, "utf8"), "user-owned\n");

    const check = runLinker(home, manifest, "--check");
    assert.equal(check.status, 0, check.stderr);
    assert.match(check.stdout, /All managed links are correct/);

    const reapply = runLinker(home, manifest, "--apply");
    assert.equal(reapply.status, 0, reapply.stderr);
    assert.match(reapply.stdout, /Applied 0 link change\(s\)/);
    assert.deepEqual(await readdir(path.join(home, ".backups")), backupEntries);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("rejects the complete manifest before mutating a valid earlier row", async () => {
  const fixture = await temporaryDirectory("preflight");
  const home = path.join(fixture, "home");
  const manifest = path.join(fixture, "links.tsv");
  const target = path.join(home, ".config", "test.conf");

  try {
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, "must-survive\n");
    await writeFile(
      manifest,
      [
        "agents/global/AGENTS.md\t~/.config/test.conf",
        "missing/source.md\t~/.config/missing.conf",
        "",
      ].join("\n"),
    );

    const apply = runLinker(home, manifest, "--apply");
    assert.equal(apply.status, 1);
    assert.match(apply.stderr, /nothing was modified/);
    assert.equal((await lstat(target)).isSymbolicLink(), false);
    assert.equal(await readFile(target, "utf8"), "must-survive\n");
    assert.equal(await pathExists(path.join(home, ".backups")), false);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("rejects a target whose existing parent resolves outside home", async () => {
  const fixture = await temporaryDirectory("containment");
  const home = path.join(fixture, "home");
  const outside = path.join(fixture, "outside");
  const manifest = path.join(fixture, "links.tsv");

  try {
    await mkdir(home, { recursive: true });
    await mkdir(outside, { recursive: true });
    await symlink(outside, path.join(home, ".config"));
    await writeFile(
      manifest,
      "agents/global/AGENTS.md\t~/.config/test.conf\n",
    );

    const apply = runLinker(home, manifest, "--apply");
    assert.equal(apply.status, 1);
    assert.match(apply.stderr, /escapes the physical home directory/);
    assert.equal(await pathExists(path.join(outside, "test.conf")), false);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("rejects duplicate targets before applying either source", async () => {
  const fixture = await temporaryDirectory("duplicate");
  const home = path.join(fixture, "home");
  const manifest = path.join(fixture, "links.tsv");

  try {
    await mkdir(home, { recursive: true });
    await writeFile(
      manifest,
      [
        "agents/global/AGENTS.md\t~/.config/test.conf",
        "skills/plan\t~/.config/test.conf",
        "",
      ].join("\n"),
    );

    const apply = runLinker(home, manifest, "--apply");
    assert.equal(apply.status, 1);
    assert.match(apply.stderr, /duplicate target in manifest/);
    assert.equal(
      await pathExists(path.join(home, ".config", "test.conf")),
      false,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
