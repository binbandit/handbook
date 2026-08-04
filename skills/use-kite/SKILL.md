---
name: use-kite
description: Operate the Kite CLI (`kt`) for its quicksave, land, publish, pull request, and undo workflow. Use when a repository uses Kite, the user asks to run or troubleshoot `kt`, work should be captured as `[kite] save` commits, saved work should be reorganized into reviewable commits, or a landed Kite branch should be published or opened as a pull request.
---

# Use Kite

Use Kite for repositories that deliberately separate fast snapshots from polished Git history.

## Inspect state first

1. Run `git status --short --branch`.
2. Run `command -v kt` and `kt --version`.
3. For land, publish, pull request, or undo work, also inspect `git log --oneline -n 12` and `git remote -v`.
4. Check `kt <command> --help` before relying on version-sensitive flags.
5. Preserve unrelated staged and unstaged changes.

If `kt` is unavailable, stop and explain the missing dependency. Install it only when the user asks or installation is an expected part of the task.

## Choose the operation

- Run `kt go <name>` to create, resume, or switch to a flow branch only when the user wants that branch change.
- Run `kt` to create a quicksave. It respects an existing staged selection; otherwise it stages the worktree and creates a `[kite] save` commit without hooks.
- Run `kt land` to preview and replace contiguous Kite saves with reviewable local commits.
- Run `kt publish` to publish the current branch after the rewritten history has been reviewed.
- Run `kt pr` to publish as needed and create or refresh a GitHub pull request after preview.
- Run `kt undo` to reverse the latest quicksave or restore the saves from the latest land.

Read [references/cli-behavior.md](references/cli-behavior.md) before land, publish, pull request, undo, configuration, or troubleshooting work.

## Respect mutation boundaries

Treat each command according to its impact:

- `kt` creates a commit but does not rewrite existing history.
- `kt go` changes the checked-out branch and may create one.
- `kt land` rewrites local commit history. Run it only when the user explicitly asks to land or otherwise authorizes that rewrite.
- `kt publish` changes the remote and can replace remote Kite saves with landed commits. Run it only with explicit publishing intent.
- `kt pr` changes GitHub state and may publish the branch first. Preview the proposed pull request unless the user explicitly requested non-interactive creation.
- `kt undo` rewrites local history. Undoing a land performs a hard reset and may also update remote history. Run it only when the user explicitly requests undo or recovery.

Do not infer permission for a destructive history rewrite from a general request to "use Kite."

## Operate safely

1. Require a ready change and a clear verification state before landing.
2. Use `--allow-dirty` only when preserving current worktree changes is intentional.
3. Treat `kt land` as local unless the user also asks to publish or passes `--push`.
4. Keep confirmation prompts enabled unless the user requests unattended operation and the exact targets are known.
5. Let normal commit hooks run during landing. Do not bypass a failing hook without explicit authorization.
6. Inspect the branch, worktree, log, and remote state after each mutating command.
7. Report what changed, what stayed local, what reached the remote, and any recovery marker or failure state.
