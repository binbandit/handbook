# Why the agent instructions look this way

Research last verified: 2026-08-05.

See [`docs/research/agent-instructions.md`](../docs/research/agent-instructions.md) for the comparative source review behind these decisions.

## The split is deliberate

The repository-root `AGENTS.md` explains how to maintain Bandit's Handbook. `agents/global/AGENTS.md` is an installable personal contract. Combining them would leak project-specific commands into every repository and make the global context larger without helping unrelated tasks.

The global contract retains Brayden's existing preferences: no em dash, no AI co-author attribution, long-term quality over short-term cost, direct end-to-end work, user-facing bug reproduction, strong visual and engineering standards, and approval before large automatic swarms. The former dangling `~/VOICE.md` and `~/OPTIONS.md` references are now conditional, so their absence cannot create a false requirement.

## Why AGENTS.md is the portable core

[AGENTS.md](https://agents.md/) is ordinary Markdown with no required schema. Its open format and nearest-file scoping make it a good common behavioral contract. Vendor-specific adapters exist only where native discovery is incomplete.

Claude Code currently reads `CLAUDE.md`, so the root adapter imports `@AGENTS.md` as recommended in [Claude Code memory](https://code.claude.com/docs/en/memory). GitHub Copilot support varies by surface, so `.github/copilot-instructions.md` contains a thin local pointer and the essential safety rules. See GitHub's [support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support).

## Why the files stay concise

Codex's documented global file lives under `~/.codex`, and its discovered instruction chain has a default combined limit of 32 KiB. Claude recommends keeping each `CLAUDE.md` below roughly 200 lines. That makes progressive disclosure a reliability feature, not just a writing preference.

The Handbook therefore puts:

- Stable, almost-always relevant rules in global instructions.
- Repository commands and invariants in the nearest `AGENTS.md`.
- Multi-step procedures in skills.
- Full evidence, alternatives, and history in this rationale.

Sources: [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) and [Claude Code memory](https://code.claude.com/docs/en/memory).

## Why prose is not the security boundary

Instructions can guide a model, but they do not constrain operating-system permissions. Requirements that must hold belong in sandboxes, tool allowlists, hooks, rules, review, and CI.

Claude advises narrow permissions and warns that hooks execute with the user's operating-system authority. Codex similarly separates command rules, hooks, and trusted project configuration from natural-language instructions. Sources: [Claude permissions](https://code.claude.com/docs/en/permissions), [Claude hooks](https://code.claude.com/docs/en/hooks), [Codex rules](https://learn.chatgpt.com/docs/agent-configuration/rules), and [Codex hooks](https://learn.chatgpt.com/docs/hooks).

## Why validation is proportional

The default is the smallest check that can disprove the change, followed by broader checks for shared or cross-cutting work. Exact commands beat general reminders, and a check that did not run is never reported as passing.

This pattern appears in mature public instruction files such as [OpenAI Codex](https://github.com/openai/codex/blob/main/AGENTS.md), [VS Code](https://github.com/microsoft/vscode/blob/main/.github/copilot-instructions.md), [Google ADK Python](https://github.com/google/adk-python/blob/main/AGENTS.md), and [Temporal Java SDK](https://github.com/temporalio/sdk-java/blob/main/AGENTS.md).

## Why Conventional Commits

The [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/) gives the history a small machine-readable grammar without requiring a heavyweight release system. `feat` and `fix` have defined meaning; `docs`, `chore`, `ci`, `refactor`, and `test` remain available.

Working directly on `main` and prohibiting AI attribution are Brayden's local policies, not claims from the specification.

## What we intentionally rejected

- A persona essay full of generic encouragement.
- A full dependency list and directory dump in always-loaded context.
- Duplicated instruction bodies for every harness.
- External links as the only copy of a required rule.
- Full test suites for every small change.
- Negative rules without a safe alternative.
- Model and price tables in durable behavioral instructions.
- Broad mutation tools for reviewer and research agents.
- Real environment values, auth state, history, caches, or session data.

## How instruction changes are tested

Treat instruction changes like code:

1. Verify discovery in each supported harness.
2. Check active scope from the root and any nested subtree.
3. Test one representative documentation, config, skill, secret, and destructive-action fixture.
4. Confirm adapters have not drifted from the canonical contract.
5. Keep the full discovered chain comfortably below platform limits.

Useful diagnostics include Codex instruction summaries, Claude `/context` and `/doctor`, and Copilot CLI `/instructions`. Because model behavior is non-deterministic, important cases should be exercised more than once before a policy is considered reliable.
