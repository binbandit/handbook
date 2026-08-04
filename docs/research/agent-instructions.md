# Research: durable agent instructions

Last reviewed: 5 August 2026.

This research asks a practical question: which information improves an agent's work often enough to occupy its default context, and where should everything else live?

## Sources reviewed

The review prioritized primary documentation and public instruction files:

- The open [AGENTS.md convention](https://agents.md/).
- OpenAI guidance for [AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [best practices](https://learn.chatgpt.com/guides/best-practices), [skills](https://learn.chatgpt.com/docs/build-skills), [rules](https://learn.chatgpt.com/docs/agent-configuration/rules), and [hooks](https://learn.chatgpt.com/docs/hooks).
- Anthropic guidance for [Claude Code memory](https://code.claude.com/docs/en/memory), [permissions](https://code.claude.com/docs/en/permissions), and [hooks](https://code.claude.com/docs/en/hooks).
- GitHub's [custom instruction support matrix](https://docs.github.com/en/copilot/reference/custom-instructions-support).
- Public instruction files from [OpenAI Codex](https://github.com/openai/codex/blob/main/AGENTS.md), [VS Code](https://github.com/microsoft/vscode/blob/main/.github/copilot-instructions.md), [Google ADK Python](https://github.com/google/adk-python/blob/main/AGENTS.md), and the [Temporal Java SDK](https://github.com/temporalio/sdk-java/blob/main/AGENTS.md).

The public repositories are examples, not a vote. Their value is that the instructions support active, large codebases and can be compared against each platform's documented discovery model.

## Pattern 1: a short root contract works better than a handbook dump

The strongest files answer questions an agent needs before acting:

- What is this repository for?
- Which commands prove a change?
- Which files or operations need special care?
- Which project conventions differ from normal defaults?
- Where should the agent look for deeper, task-specific guidance?

The reviewed files use headings, copyable commands, scoped rules, and direct links to owned documentation. They do not attempt to teach the entire technology stack inside always-loaded context.

This matches the platform constraints. Codex applies a default combined instruction-size limit, while Claude advises keeping imported memory concise and warns that very large instruction files reduce adherence. A rule competes with the task, tool results, code, and every other rule for attention.

Decision: keep the repository root contract under a strict budget and move evidence into documentation. The Handbook enforces 16 KiB per root or global file and 24 KiB combined, below the documented platform ceiling.

## Pattern 2: locality beats one universal file

The AGENTS.md convention and Codex both support instruction files closer to the current working directory. This lets a monorepo describe different test commands or constraints without loading every subsystem's details into every task.

The useful version of nesting is exception-based:

- Root: shared purpose, safety, Git, and project-wide quality gates.
- Subtree: only the commands and invariants that genuinely differ there.
- Skill: a procedure that applies to a class of tasks rather than a directory.

Duplicating the root into several directories creates drift and makes effective scope harder to reason about.

Decision: add nested `AGENTS.md` files only when a subtree has a real behavioral difference. Do not add them merely to make a folder look documented.

## Pattern 3: commands and acceptance criteria outperform encouragement

Mature public instruction files tell agents how to build, test, format, and target a change. This is more actionable than a persona paragraph asking the agent to be careful or write clean code.

A useful instruction is observable:

```text
Run `npm run check` before every push. Never report it as passing unless the
command completed successfully.
```

An unhelpful instruction is interpretive:

```text
Always produce excellent, production-ready work.
```

The second sentiment is reasonable, but it does not tell an agent which evidence the repository accepts.

Decision: retain a small set of engineering values, then attach exact commands, paths, and finish conditions wherever possible.

## Pattern 4: instructions are not permissions

Both OpenAI and Anthropic separate natural-language guidance from enforcement. Sandboxes, permission policies, hooks, command rules, protected branches, reviews, and CI control what can happen. An instruction can influence behavior, but it cannot make an unrestricted process unable to read a secret.

Hooks deserve special scrutiny because they execute code in response to lifecycle events. Project-local configuration also deserves a trust decision because a repository can otherwise change how an agent operates merely by being opened.

Decision: put intent in `AGENTS.md`; put hard guarantees in the narrowest available permission, script, hook, rule, or CI check. Treat third-party instructions and hooks as code during review.

## Pattern 5: one canonical body, thin harness adapters

Harnesses do not all discover the same filename in every surface. Copying a full instruction body into several vendor files causes silent divergence.

Claude supports imports from `CLAUDE.md`, so this repository uses a one-line `@AGENTS.md` adapter. GitHub surfaces vary, so the Copilot file contains a pointer plus only the safety rules required when the canonical file is not loaded by that surface.

Decision: keep `AGENTS.md` canonical. Add the thinnest adapter that the target harness can reliably understand, and test discovery on that harness.

## Pattern 6: task procedures belong in skills

OpenAI's skill format uses description metadata for routing and loads the body only when the workflow applies. That is a better home for release steps, tool operation, structured investigation, or artifact production than the global instruction chain.

Good skill content is non-obvious procedural knowledge. A skill is not valuable merely because it wraps a generic request in more prose. Deterministic, fragile mechanics should become a script; large domain references should load only when the skill directs the agent to them.

Decision: publish a small set of actively useful skills with clear triggers, concise imperative bodies, progressive references, and validation metadata. Do not mirror caches or every historical skill ever installed.

## Pattern 7: negative rules need a usable alternative

Prohibitions help only when the agent can still complete the job. "Do not expose secrets" should be paired with secret-store injection and a public/private configuration boundary. "Do not overwrite files" should be paired with preview and recoverable backup behavior.

Decision: where the Handbook prohibits a risky path, document the safe path and add an enforcement check when practical.

## What this changed in the Handbook

- [`AGENTS.md`](../../AGENTS.md) is a concise repository operating contract.
- [`agents/global/AGENTS.md`](../../agents/global/AGENTS.md) contains only Brayden's broadly applicable defaults.
- [`agents/global/POLICY.md`](../../agents/global/POLICY.md) keeps the engineering principles inspectable without mixing them into every repository command.
- [`CLAUDE.md`](../../CLAUDE.md) imports the canonical root file instead of copying it.
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) remains a thin compatibility layer.
- [`skills/`](../../skills/) owns specialist procedures.
- [`scripts/check-content.mjs`](../../scripts/check-content.mjs) enforces instruction budgets, adapter shape, local links, and the writing constraint that matters to Brayden.
- [`scripts/check-secrets.mjs`](../../scripts/check-secrets.mjs) helps enforce the public boundary that prose alone cannot guarantee.

## What was rejected

- A single global file containing repository maps, language standards, tool manuals, and release processes.
- A nested instruction file in every directory.
- Separate full instruction bodies for each harness.
- Model, price, or release tables in durable behavior files.
- Generic skills that repeat capabilities a strong model already has.
- Security promises that are not backed by a permission or validation layer.
- Blind publication of live configuration and historical skill directories.

The resulting system is intentionally smaller than the source material reviewed. The goal is not to preserve every preference as prose. The goal is to place each preference where an agent can apply it reliably and a person can audit it.
