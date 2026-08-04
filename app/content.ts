export type HandbookPage = {
  slug: string;
  navTitle: string;
  eyebrow: string;
  title: string;
  description: string;
  sourcePath: string;
  readingTime: string;
  tags: string[];
};

export const handbookPages: HandbookPage[] = [
  {
    slug: "/start",
    navTitle: "Start here",
    eyebrow: "Orientation / 01",
    title: "Build the system before you chase speed.",
    description:
      "The shortest path from a blank machine to an AI setup that can understand your standards, use your tools, and prove its work.",
    sourcePath: "README.md",
    readingTime: "8 min",
    tags: ["setup", "prompting", "workflow"],
  },
  {
    slug: "/system",
    navTitle: "The operating system",
    eyebrow: "Foundation / 02",
    title: "AI work is a loop, not a chat window.",
    description:
      "Brayden's operating model keeps intent, context, action, and proof connected from the first prompt to the final commit.",
    sourcePath: "docs/architecture/repository.md",
    readingTime: "7 min",
    tags: ["system", "context", "verification"],
  },
  {
    slug: "/harnesses/codex",
    navTitle: "Codex",
    eyebrow: "Harness / 01",
    title: "Use Codex as the lead operator.",
    description:
      "Long-running implementation, repo-aware instructions, bounded delegation, and evidence-backed delivery in one harness.",
    sourcePath: "harnesses/codex.md",
    readingTime: "12 min",
    tags: ["codex", "harness", "subagents"],
  },
  {
    slug: "/harnesses/pi",
    navTitle: "Pi",
    eyebrow: "Harness / 02",
    title: "Keep a small, inspectable second harness.",
    description:
      "Pi is the compact terminal harness in the system: direct, composable, and useful when the work benefits from a lighter control surface.",
    sourcePath: "harnesses/pi.md",
    readingTime: "10 min",
    tags: ["pi", "harness", "packages"],
  },
  {
    slug: "/agents/instructions",
    navTitle: "Instructions",
    eyebrow: "Agent layer / 01",
    title: "Instructions are the interface to your standards.",
    description:
      "A concise root contract, scoped local detail, and one canonical source give every harness the right rules without wasting context.",
    sourcePath: "agents/global/AGENTS.md",
    readingTime: "9 min",
    tags: ["agents.md", "instructions", "context"],
  },
  {
    slug: "/agents/skills",
    navTitle: "Skills",
    eyebrow: "Agent layer / 02",
    title: "Load procedures at the moment they matter.",
    description:
      "Skills package repeatable workflows, tools, references, and guardrails without crowding every conversation.",
    sourcePath: "skills/README.md",
    readingTime: "7 min",
    tags: ["skills", "procedures", "tools"],
  },
  {
    slug: "/agents/delegation",
    navTitle: "Delegation",
    eyebrow: "Agent layer / 03",
    title: "Parallelize questions, not confusion.",
    description:
      "Split work across agents without duplicating effort, colliding on files, or losing accountability for the result.",
    sourcePath: "playbooks/delegation.md",
    readingTime: "8 min",
    tags: ["delegation", "parallel", "coordination"],
  },
  {
    slug: "/tools/herdr",
    navTitle: "Herdr",
    eyebrow: "Tool / Active use",
    title: "See the whole agent field at once.",
    description:
      "Herdr is the terminal control plane Brayden uses when one AI task fans out across multiple agents, panes, and machines.",
    sourcePath: "tools/herdr.md",
    readingTime: "15 min",
    tags: ["herdr", "agents", "terminal", "coordination"],
  },
  {
    slug: "/tools/kite",
    navTitle: "Kite",
    eyebrow: "Tool / Active use",
    title: "Save fast. Land clean history.",
    description:
      "Kite separates zero-friction Git snapshots from the AI-assisted work of shaping reviewable commits and pull requests.",
    sourcePath: "tools/kite.md",
    readingTime: "13 min",
    tags: ["kite", "git", "commits", "pull requests"],
  },
  {
    slug: "/tools/axi",
    navTitle: "AXI",
    eyebrow: "Tool / Worth knowing",
    title: "Design command lines for the agent using them.",
    description:
      "AXI is included as a useful idea, not a personal dependency: agent ergonomics should shape the interfaces we give AI.",
    sourcePath: "tools/axi.md",
    readingTime: "9 min",
    tags: ["axi", "cli", "agent experience", "awareness"],
  },
  {
    slug: "/playbooks/context-to-completion",
    navTitle: "Context to completion",
    eyebrow: "Playbook / 01",
    title: "Turn a rough idea into a verified result.",
    description:
      "The default end-to-end loop for substantial AI work, from framing and inspection through implementation and handoff.",
    sourcePath: "playbooks/context-to-completion.md",
    readingTime: "9 min",
    tags: ["playbook", "workflow", "delivery"],
  },
  {
    slug: "/playbooks/verification",
    navTitle: "Verification",
    eyebrow: "Playbook / 02",
    title: "Make proof part of the build loop.",
    description:
      "Validation is the feedback system that lets AI move quickly without quietly lowering the engineering bar.",
    sourcePath: "playbooks/verification.md",
    readingTime: "8 min",
    tags: ["verification", "tests", "review"],
  },
  {
    slug: "/playbooks/git-with-agents",
    navTitle: "Git with agents",
    eyebrow: "Playbook / 03",
    title: "Use Git as the shared memory of the work.",
    description:
      "Protect user changes, shape reviewable history, and use GitHub as the handoff surface for agent-assisted delivery.",
    sourcePath: "playbooks/git-and-github.md",
    readingTime: "10 min",
    tags: ["git", "github", "commits", "review"],
  },
  {
    slug: "/setup/portable",
    navTitle: "Portable setup",
    eyebrow: "Reference / Setup",
    title: "Sync the AI layer without cloning a whole identity.",
    description:
      "An auditable link manifest keeps the useful parts consistent across devices while private and machine-specific state stays local.",
    sourcePath: "setup/portable.md",
    readingTime: "10 min",
    tags: ["setup", "sync", "devices", "security"],
  },
  {
    slug: "/reference/command-surface",
    navTitle: "Command surface",
    eyebrow: "Reference / Terminal",
    title: "Keep the terminal layer small and agent-shaped.",
    description:
      "Fish abbreviations shorten the AI and Git loops Brayden repeats. They are not a catalog of an entire shell setup.",
    sourcePath: "setup/fish.md",
    readingTime: "9 min",
    tags: ["fish", "aliases", "terminal", "git"],
  },
  {
    slug: "/reference/repository",
    navTitle: "Repository map",
    eyebrow: "Reference / Architecture",
    title: "One source, four layers of leverage.",
    description:
      "The repository separates durable instructions, reusable capability, portable configuration, and the playbooks that connect them.",
    sourcePath: "docs/architecture/repository.md",
    readingTime: "6 min",
    tags: ["repository", "architecture", "contributing"],
  },
];

export const navGroups = [
  { label: "Foundation", slugs: ["/start", "/system"] },
  { label: "Harnesses", slugs: ["/harnesses/codex", "/harnesses/pi"] },
  {
    label: "Agent layer",
    slugs: [
      "/agents/instructions",
      "/agents/skills",
      "/agents/delegation",
    ],
  },
  { label: "Tools", slugs: ["/tools/herdr", "/tools/kite", "/tools/axi"] },
  {
    label: "Playbooks",
    slugs: [
      "/playbooks/context-to-completion",
      "/playbooks/verification",
      "/playbooks/git-with-agents",
    ],
  },
  {
    label: "Reference",
    slugs: [
      "/setup/portable",
      "/reference/command-surface",
      "/reference/repository",
    ],
  },
] as const;

export const handbookPageBySlug = new Map(
  handbookPages.map((page) => [page.slug, page]),
);

export function getAdjacentPages(slug: string) {
  const index = handbookPages.findIndex((page) => page.slug === slug);

  return {
    previous: index > 0 ? handbookPages[index - 1] : null,
    next:
      index >= 0 && index < handbookPages.length - 1
        ? handbookPages[index + 1]
        : null,
  };
}
