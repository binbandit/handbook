# Agent files

Agent instructions are the durable behavioral layer of Brayden's AI operating system. They encode how an agent should work, while harness configuration determines what the agent can access and skills teach specialist procedures.

## Scope model

1. [`global/AGENTS.md`](global/AGENTS.md) contains stable preferences that should follow Brayden between projects.
2. A repository-root `AGENTS.md` describes that repository's purpose, architecture, commands, and non-negotiable rules.
3. A nested `AGENTS.md` is reserved for a subtree with genuinely different constraints.
4. Skills contain detailed procedures that should enter context only for relevant tasks.
5. Harness settings, hooks, permissions, and rules enforce boundaries that prose cannot.

## Installing the global contract

[`setup/links.tsv`](../setup/links.tsv) maps the canonical file to both `~/AGENTS.md` and the official Codex global location. Preview first:

```bash
./scripts/link-dotfiles.sh --preview
./scripts/link-dotfiles.sh --apply
```

Existing targets are moved into a private timestamped backup tree before links are created.

## Editing policy

Change the source in this repository. Linked destinations write through to the source. The rationale and research log live in [`rationale.md`](rationale.md).
