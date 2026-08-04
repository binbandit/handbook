# 0001: Use auditable shell links for portable AI configuration

- Status: accepted
- Date: 2026-08-05

## Decision

Bandit's Handbook uses a small POSIX shell linker and a tab-separated manifest to install the AI-specific files worth sharing between devices.

The default operation is a read-only preview. Apply mode moves every existing target into a private timestamped backup tree that preserves its path under `$HOME`, then creates an absolute symlink to the reviewed source file in this repository.

## Why

The public setup should be understandable to an engineer in one sitting. Requiring an unfamiliar management tool would make the Handbook harder to trust and copy.

The shell layer has one job:

```text
reviewed source -> preview -> path-preserving backup -> symlink -> health check
```

Static links remove copy drift. Editing a managed destination edits the repository source. Git then supplies multi-device history, review, rebasing, conflict markers, and remembered resolutions.

## Safety properties

- Targets must stay under `$HOME`.
- Sources must stay inside the repository.
- Preview is the default.
- Apply never overwrites a collision in place.
- Backups retain the original relative target path.
- An existing correct link is idempotent.
- Check mode fails when any managed link differs.
- Private values are not part of the public manifest.

## Alternatives considered

### GNU Stow

[GNU Stow](https://www.gnu.org/software/stow/manual/stow.html) is a well-established symlink farm manager. It is a good choice for larger homogeneous dotfile trees. The Handbook links a deliberately small, explicit set of AI-specific files, so a readable manifest and bounded script provide enough behavior without an additional prerequisite.

Reconsider if the managed file set grows substantially or needs package-style composition.

### Copy-on-install scripts

Copying is familiar but creates two editable versions. A later sync step must guess which copy is authoritative. Symlinks keep the source visible and make drift easier to reason about.

### Hidden per-device Git behavior

`skip-worktree`, `assume-unchanged`, automatic union merges, and permanent device branches can hide divergence until it becomes difficult to recover. Git documents `skip-worktree` primarily as a sparse-checkout mechanism, not a local configuration system. Sources: [git-update-index](https://git-scm.com/docs/git-update-index) and [gitattributes](https://git-scm.com/docs/gitattributes).

## Consequences

- The link script and manifest become security-sensitive and receive explicit ownership and tests.
- Private work configuration needs its own private source rather than clever exceptions in the public tree.
- Package installation remains separate from file linking.
- The system optimizes for a focused AI setup, not every possible dotfile.
