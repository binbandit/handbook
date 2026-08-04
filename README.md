# Bandit's Handbook

> An AI operating system for engineers who want leverage without surrendering judgment.

Bandit's Handbook is the public source of truth for how BinBandit works with AI: the harnesses, agent instructions, skills, tools, context patterns, delegation systems, and verification loops that turn models into capable engineering partners.

This is not a tour of an entire developer environment. Terminal and Git material appears only where it gives an agent better context, safer tools, clearer boundaries, or a faster path to verified work.

## What lives here

- **Harnesses**: how Brayden configures and combines Codex, Pi, and other agent runtimes.
- **Agent contracts**: the global and repository instructions that encode durable working preferences.
- **Skills**: specialist capabilities that enter context only when a task needs them.
- **Agent tools**: Herdr, Kite, browser access, GitHub, and other surfaces that let agents observe and act.
- **Playbooks**: repeatable loops for building, debugging, reviewing, researching, and shipping with AI.
- **Verification**: how to keep speed from outrunning evidence.
- **Portable setup**: a small shell-based linker for the AI-specific files worth syncing between devices.

## Start here

- Read the handbook website for the guided path.
- Open [`agents/global/AGENTS.md`](agents/global/AGENTS.md) for Brayden's portable global agent contract.
- Read [`agents/rationale.md`](agents/rationale.md) for the research and tradeoffs behind it.
- Browse [`skills/`](skills/) for reusable capabilities.
- Inspect [`setup/links.tsv`](setup/links.tsv) before linking any files into a home directory.
- Run `./scripts/bootstrap.sh --help` before applying the portable profile.

## Repository map

```text
.
├── agents/       Installable instructions and their rationale
├── skills/       Task-specific capabilities for AI agents
├── playbooks/    End-to-end ways of working with AI
├── tools/        Guide sources for harnesses and agent-facing tools
├── dotfiles/     The small set of AI-enabling config worth syncing
├── setup/        Auditable link and package manifests
├── docs/         Architecture, research, and decision records
├── app/          The public handbook website
└── scripts/      Preview, backup, link, sync, and validation commands
```

## Safe portable setup

The setup layer is intentionally boring. A tab-separated manifest maps reviewed repository files to locations under `$HOME`. The linker previews by default. On apply, every collision moves to a timestamped backup tree that preserves its original path before a symlink is created.

```bash
# Read-only preview
./scripts/bootstrap.sh

# Install the focused tool bundle, back up collisions, and link files
./scripts/bootstrap.sh --install-tools --apply

# Verify an installed device
./scripts/doctor.sh
```

Static links make edits flow directly back to the checkout. Git handles differences between devices. Private work values remain in a separate private source and never enter this repository.

See [`docs/decisions/0001-use-auditable-shell-links.md`](docs/decisions/0001-use-auditable-shell-links.md) for the design.

## The public boundary

The repository contains configuration, never credentials. Secret values belong in the operating system credential store or a private source. Auth state, transcripts, histories, private endpoints, employer details, and device identifiers are local state.

Before every push:

```bash
npm run check
```

## Contributing

Work happens on `main` with conventional commit messages. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) and the nearest `AGENTS.md` before changing anything.

## License

Original handbook content and configuration are released under the [MIT License](LICENSE). Third-party material keeps its original license and attribution.
