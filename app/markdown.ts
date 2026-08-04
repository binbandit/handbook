import agents from "../agents/global/AGENTS.md?raw";
import repository from "../docs/architecture/repository.md?raw";
import codex from "../harnesses/codex.md?raw";
import pi from "../harnesses/pi.md?raw";
import contextToCompletion from "../playbooks/context-to-completion.md?raw";
import delegation from "../playbooks/delegation.md?raw";
import gitAndGitHub from "../playbooks/git-and-github.md?raw";
import verification from "../playbooks/verification.md?raw";
import readme from "../README.md?raw";
import fish from "../setup/fish.md?raw";
import portable from "../setup/portable.md?raw";
import skills from "../skills/README.md?raw";
import axi from "../tools/axi.md?raw";
import herdr from "../tools/herdr.md?raw";
import kite from "../tools/kite.md?raw";

export const markdownBySourcePath: Record<string, string> = {
  "README.md": readme,
  "docs/architecture/repository.md": repository,
  "harnesses/codex.md": codex,
  "harnesses/pi.md": pi,
  "agents/global/AGENTS.md": agents,
  "skills/README.md": skills,
  "playbooks/delegation.md": delegation,
  "tools/herdr.md": herdr,
  "tools/kite.md": kite,
  "tools/axi.md": axi,
  "playbooks/context-to-completion.md": contextToCompletion,
  "playbooks/verification.md": verification,
  "playbooks/git-and-github.md": gitAndGitHub,
  "setup/portable.md": portable,
  "setup/fish.md": fish,
};

export function markdownBody(markdown: string) {
  return markdown.replace(/^#\s+.+\r?\n+/, "");
}

export function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[`*_~:[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function markdownHeadings(markdown: string) {
  return markdownBody(markdown)
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^##\s+(.+)$/);
      if (!match) return [];
      const title = match[1].replace(/[`*_~]/g, "").trim();
      return [{ id: headingId(title), title }];
    });
}
