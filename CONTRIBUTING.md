# Contributing

Bandit's Handbook favors useful, tested field notes over broad collections of tips.

## Before you change something

1. Read the root [`AGENTS.md`](AGENTS.md) and any nearer instructions.
2. Search for an existing guide or decision that owns the topic.
3. Decide whether the change teaches an AI workflow, changes a portable artifact, records a personal opinion, or belongs in a private source.
4. Keep secrets and employer-specific details out of the repository.

## A useful guide includes

- The outcome and who the guide is for.
- Prerequisites and supported platform.
- Copyable, bounded steps.
- A verification command or observable success state.
- Failure modes worth knowing.
- The reason this approach is recommended.
- A primary source for facts that can change.

## Validate

```bash
npm ci
npm run check
```

Portable setup changes should also be previewed and checked:

```bash
./scripts/link-dotfiles.sh --preview
./scripts/doctor.sh
```

## Commit and push

Work directly on `main`. Use Conventional Commits, for example:

```text
docs: explain the worktree review loop
feat: add a portable pi profile
fix: keep fish startup safe in non-interactive shells
```

Never add an AI tool or agent as a co-author or mention AI authorship in a commit title or body.
