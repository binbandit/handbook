# Portable setup and device sync

The Handbook can install its public AI operating layer without overwriting a home directory or depending on a private device manager. It uses a small manifest, an auditable shell linker, path-preserving backups, and Git.

## What it manages

The public link manifest covers only portable AI-enabling files:

- Global agent instructions and policy.
- Curated skills linked individually into Codex, Pi, and Claude Code.
- Pi harness settings.
- Herdr preferences.
- Fish initialization, abbreviations, and the Handbook sync helper.
- Git defaults and ignore rules used in agent workflows.
- A small mise tool manifest.

It deliberately does not link the example Codex config. Real Codex configuration commonly contains device trust, private provider, notification, and tool-server settings that should not be published or replaced automatically.

The canonical mapping is [`links.tsv`](links.tsv). Every source is inside the repository and every target is under the current user's home directory.

## Preview first

Clone the repository, then inspect what the bootstrap would do:

```bash
git clone https://github.com/binbandit/handbook.git "$HOME/.bandits-handbook"
cd "$HOME/.bandits-handbook"
./scripts/bootstrap.sh
```

Preview is the default. It prints package and link actions without changing the machine.

Apply only the links:

```bash
./scripts/bootstrap.sh --apply
```

Install the curated Homebrew tools and apply links:

```bash
./scripts/bootstrap.sh --install-tools --apply
```

The package manifest is intentionally narrow. It supports the AI workflow rather than attempting to reproduce an entire workstation.

## How conflicts are handled

The linker never deletes an existing target. On apply:

1. The complete manifest is validated before any mutation.
2. Duplicate targets, missing sources, unsafe paths, and target parents that resolve outside the physical home directory stop the run.
3. A correct existing symlink is left alone.
4. A conflicting file, directory, or symlink moves to a timestamped backup.
5. The backup preserves the target's path below `~/.bandits-handbook-backups/`.
6. An absolute symlink points the target to the repository source.

Apply mode also uses a lock so two syncs cannot race. If creating a link fails after its target was preserved, the linker attempts to restore that exact target before reporting the error.

Preview the mapping directly:

```bash
./scripts/link-dotfiles.sh --preview
```

Apply it:

```bash
./scripts/link-dotfiles.sh --apply
```

Verify every managed target:

```bash
./scripts/link-dotfiles.sh --check
./scripts/doctor.sh
```

Repeated apply is idempotent. Once a target points to the correct source, nothing is moved or recreated.

## Sync a device

The sync script refuses to rebase a dirty Handbook checkout. This prevents incoming changes from being mixed with local edits:

```bash
./scripts/sync.sh
```

That command fetches and rebases `main`, then previews the link plan. Apply after reviewing it:

```bash
./scripts/sync.sh --apply
```

From Fish, the linked helper provides the same behavior:

```fish
handbook-sync
handbook-sync --apply
```

## Customize without forking everything

Use three layers:

1. Public portable defaults in this repository.
2. A private repository or untracked local files for employer, credential, and machine-specific settings.
3. Runtime state owned by each application.

Do not add generated histories, session databases, caches, auth files, or a live home directory dump to the Handbook. If a private difference should affect public behavior, document the interface without publishing its value.

## Recover a replaced target

Before restoring, inspect the relevant timestamped directory:

```bash
find ~/.bandits-handbook-backups -maxdepth 4 -print
```

Remove only the exact Handbook symlink you intend to replace, then move the backup to its original target. Do not use a recursive delete or a broad glob. The backup is deliberately path-preserving so its destination is visible.

Run the doctor afterward:

```bash
./scripts/doctor.sh
```

This setup favors boring shell primitives because they are inspectable on every device, easy for an agent to reason about, and recoverable without access to a private application.
