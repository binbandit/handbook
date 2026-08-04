# Bandit's Handbook repository instructions

This file is the operating contract for people and coding agents working in this repository.

## Purpose

Bandit's Handbook documents Brayden's AI operating system and distributes its portable instruction, skill, and tool configuration. Changes must help engineers work more effectively with AI, remain safe to publish, and be dependable when applied to a real machine.

## Non-negotiable rules

- Never use the em dash character. Use a plain hyphen, colon, semicolon, or rewrite the sentence.
- Work on `main`. Do not create or switch branches unless Brayden explicitly changes this rule.
- Use Conventional Commits for every commit.
- Never add an AI tool or agent as a commit co-author. Do not mention AI authorship in commit titles or bodies.
- Never commit credentials, tokens, cookies, private keys, `.env` files, work hostnames, internal endpoints, corporate email addresses, certificate paths, or authentication state.
- Do not copy live config wholesale. Curate and sanitize it first.
- Never manually edit generated output, lock data owned by applications, session transcripts, histories, caches, state databases, or changelogs marked as generated.
- Preserve unrelated user changes. Inspect the worktree before editing and keep each commit intentional.

## Repository map

- `agents/`: portable instruction files and design rationale.
- `skills/`: reusable procedures loaded only when relevant.
- `dotfiles/`: the small set of AI-enabling configuration worth syncing.
- `setup/`: auditable link and package manifests.
- `playbooks/`: end-to-end AI working loops.
- `tools/`: canonical guide sources for harnesses and agent-facing tools.
- `docs/`: architecture, research, and decision records.
- `app/`: website routes and presentation.
- `public/`: static website assets.
- `scripts/`: safe bootstrap, sync, and validation entry points.

Add a nested `AGENTS.md` only when a subtree genuinely needs different commands or constraints. Do not repeat the root file.

## Working method

1. Read the nearest applicable instructions and the files that own the behavior.
2. Reproduce bugs through the user-facing path when practical.
3. Prefer the simplest direct end-to-end solution that meets the real requirement.
4. Keep public defaults portable. Put private or machine-specific differences in a separate private source.
5. Update the handbook page, source artifact, and decision record together when a choice changes.
6. Validate in proportion to risk before committing.

## Quality gates

Run the complete gate before every push:

```bash
npm run check
```

Useful focused commands:

```bash
npm run dev
npm run build
npm run lint
npm test
npm run check:content
npm run check:secrets
```

For setup changes, also preview the linker and run its health check:

```bash
./scripts/link-dotfiles.sh --preview
./scripts/doctor.sh
```

## Content standard

- Lead with the outcome and explain the tradeoff behind each recommendation.
- Commands must be copyable, bounded, and accompanied by a verification step.
- Prefer official and primary sources. Record the access date for facts likely to change.
- Mark personal preference as opinion and security requirements as requirements.
- Explain why a tool is used and when a reader should choose something else.
- Do not claim a command was tested unless it was actually run in the stated environment.

## Website standard

- Keep the first viewport specific to Brayden's AI operating system, not generic documentation chrome.
- Preserve keyboard access, visible focus, semantic headings, responsive layout, and reduced-motion support.
- Avoid ornamental dependencies and speculative interactions.
- Treat broken links, overflow, layout shifts, lint failures, and flaky tests as product defects.

## Git discipline

- Commit one coherent milestone at a time directly to `main`.
- Use a type such as `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `ci` with a concise imperative description.
- Review the staged diff and secret check before committing.
- Push each completed milestone after its checks pass.
