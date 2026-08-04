# Fish as an AI command surface

> Status: active use
>
> Last verified: 5 August 2026
>
> Source: [Fish documentation](https://fishshell.com/docs/current/)

I use Fish for the thin interactive layer around my AI tools. This is not a complete shell customization guide. The configuration exists to make harnesses easy to start, keep Git state visible, and expose a small set of memorable commands without hiding what they execute.

## Install

```bash
brew install fish
fish --version
fish
```

Changing the login shell is optional. Try Fish interactively first. If it fits the machine and policy, add the Homebrew path to `/etc/shells` only when it is absent, then change the shell:

```bash
command -v fish
grep -Fx "$(command -v fish)" /etc/shells
chsh -s "$(command -v fish)"
```

The `/etc/shells` edit requires administrator authority and is deliberately not automated by this Handbook.

Source: [Fish tutorial](https://fishshell.com/docs/current/tutorial.html), [default shell guidance](https://fishshell.com/docs/current/#default-shell).

## The portable layout

The Handbook links four focused pieces:

```text
~/.config/fish/config.fish
~/.config/fish/conf.d/00-init.fish
~/.config/fish/conf.d/10-abbr.fish
~/.config/fish/functions/handbook-sync.fish
```

The checked-in sources live under [`dotfiles/config/fish/`](../dotfiles/config/fish/). Fish automatically loads `conf.d/*.fish` in filename order, which keeps initialization separate from interactive abbreviations.

`00-init.fish` does three jobs:

- Adds Homebrew, local, Cargo, and mise shim locations when they exist.
- Disables terminal flow control so `Ctrl+S` cannot freeze an interactive shell.
- Loads an optional machine-private overlay without putting its values in the public repository.

Missing optional tools do not make the shell noisy or unusable.

## Prefer visible abbreviations

Fish abbreviations expand in the command line before execution. I prefer them over opaque aliases because both I and an agent can see and edit the real command that will run.

The active set is intentionally small:

| Abbreviation | Expands to | Why it exists |
| --- | --- | --- |
| `cdx` | `codex` | Start the primary delivery harness |
| `pai` | `pi` | Start the malleable terminal harness |
| `hdr` | `herdr` | Open the multi-agent control plane |
| `gs` | `git status --short --branch` | Read the worktree state before acting |
| `gd` | `git diff` | Inspect unstaged work |
| `gds` | `git diff --staged` | Review exactly what will be committed |
| `gl` | `git log --oneline --decorate --graph -20` | Recover recent history and style quickly |
| `cwd` | `pwd \| pbcopy` | Copy an explicit working directory into a harness task |

See the canonical file at [`dotfiles/config/fish/conf.d/10-abbr.fish`](../dotfiles/config/fish/conf.d/10-abbr.fish).

I avoid abbreviations that silently delete, reset, force push, bypass checks, or turn a multi-step mutation into a harmless-looking word. A good abbreviation reduces recall cost while preserving intent.

## Add a new abbreviation

Add it to the checked-in `10-abbr.fish`, not through an untracked interactive mutation:

```fish
abbr --add cdx 'codex'
```

Use a short name only when all of these are true:

- The command is frequent in the AI workflow.
- Its expansion remains obvious when displayed.
- It is safe to trigger interactively.
- It has one stable meaning across devices.

Put longer procedures in a Fish function, repository script, or agent skill instead of compressing them into an abbreviation.

Source: [Fish abbreviations](https://fishshell.com/docs/current/cmds/abbr.html).

## Verify the shell layer

Parse the checked-in files without starting an interactive session:

```bash
fish --no-execute dotfiles/config/fish/config.fish
fish --no-execute dotfiles/config/fish/conf.d/00-init.fish
fish --no-execute dotfiles/config/fish/conf.d/10-abbr.fish
fish --no-execute dotfiles/config/fish/functions/handbook-sync.fish
```

After linking, start a clean Fish process and inspect the relevant expansions:

```fish
fish
abbr --show cdx
abbr --show pai
abbr --show hdr
abbr --show gs
type handbook-sync
```

Run the full device check from the repository:

```bash
./scripts/doctor.sh
```

## Update and recovery

Fish itself updates through Homebrew:

```bash
brew update
brew upgrade fish
fish --version
./scripts/doctor.sh
```

Handbook configuration updates through the repository:

```fish
handbook-sync
handbook-sync --apply
```

If the linker replaced an existing target, its timestamped, path-preserving copy remains under `~/.bandits-handbook-backups/`. Follow [`setup/portable.md`](portable.md) for recovery rather than deleting a directory of shell configuration.

## Uninstall

Switch the login shell to another installed shell before removing Fish if Fish currently owns login:

```bash
printf '%s\n' "$SHELL"
chsh -s /bin/zsh
brew uninstall fish
command -v fish
```

Removing the binary does not remove `~/.config/fish` or the Handbook backups. Keep configuration recoverable until the replacement shell has been tested.

## When I would not add shell configuration

I skip a shell helper when the underlying tool is rarely used, the command is destructive, the expansion would vary by employer or device, or a repository script already provides a clearer cross-shell interface.

The goal is not a clever terminal. It is a legible launch and inspection surface for the AI system.
