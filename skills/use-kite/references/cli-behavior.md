# Kite CLI behavior

Read this reference for exact mutation boundaries and implementation details. Confirm version-sensitive syntax with `kt <command> --help` before acting.

## Command impact

| Command | Local effect | Remote effect | History rewrite |
| --- | --- | --- | --- |
| `kt go <name>` | Switch or create a branch | May fetch branch information | No |
| `kt` | Stage changes and create a quicksave commit | None | No existing history |
| `kt land` | Replace top-of-history Kite saves with grouped commits | None by default | Yes, local |
| `kt land --push` | Land, then publish | Push the landed branch | Yes, local and possibly remote |
| `kt publish` | Keep local history | Push, with guarded force when required | Possibly remote |
| `kt pr` | Gather branch context | Publish as needed and create or update a pull request | Possibly remote through publish |
| `kt undo` | Uncommit a quicksave or reset a land | May restore remote pre-land history | Yes |

## `kt go <name>`

- Switch to the named local branch when it already exists.
- Check for a remote-only branch and track it rather than creating divergent history with the same name.
- Create a new branch from the detected default branch when no matching branch exists.
- Prefer `origin/HEAD` when available, then fall back to common default branch names or the current branch.
- Treat this command as optional. The remaining Kite commands operate on the current branch without it.

## `kt`

- Refuse to snapshot an unresolved merge.
- Exit without a commit when the worktree is clean.
- Commit only the existing staged selection when the index already contains staged changes.
- Otherwise run the equivalent of `git add -A` and capture tracked plus untracked changes.
- Create a commit with a `[kite] save HH:MM:SS` subject.
- Skip Git hooks for quicksaves.

This is a new commit, not a rewrite of existing history. Inspect a pre-existing staged selection because it changes what the quicksave captures.

## `kt land [--push] [--yes] [--allow-dirty]`

- Require an existing `HEAD` commit and contiguous `[kite] save` commits at the top of history.
- Require a clean worktree by default. Use `--allow-dirty` to stash and restore local changes around the land.
- Build a proposed commit plan from the saved diff and recent repository commit style.
- Allow a single file's hunks to be assigned to different commits when the plan can be replayed exactly.
- Verify that the proposed commits reproduce the saved tree. Fall back to whole-file grouping when exact hunk replay is not possible.
- Preview the plan before rewriting. `--yes` skips the prompt but does not make the operation non-destructive.
- Replace the contiguous quicksaves with normal commits, so Git hooks run.
- Record rollback state before moving the target branch or detached `HEAD`.
- Keep landing local unless `--push` is present.
- Restore the original saves when a normal landing failure occurs. Require explicit recovery with `kt undo` after an interrupted rewrite.

`kt land` is destructive in the Git sense because it changes commit identities and moves history. The resulting file tree should remain equivalent, but commit hashes and ancestry change.

## `kt publish`

- Exit successfully without publishing when no remote exists.
- Require a branch because a detached `HEAD` does not provide a remote branch name.
- Push normally when the remote branch is absent or is already an ancestor of local `HEAD`.
- Use an explicit force-with-lease expectation when the remote contains the quicksaves replaced by a land.
- Refuse a stale lease when the remote moved since the expected state was observed.
- Ask before discarding remote commits that are not recognized Kite saves.
- Avoid rebasing onto the remote's pre-land quicksaves.

Publishing is an external mutation. A guarded force still replaces remote history, so require explicit publishing intent.

## `kt pr [--draft] [--base <branch>] [--yes]`

- Require a branch, a remote, an authenticated GitHub CLI, and no unlanded Kite saves.
- Refuse to open a pull request from the detected base branch.
- Publish the branch when it is missing or behind on the remote.
- Build a draft from commits, diff, repository pull request templates, relevant installed skills, and recent pull request style.
- Fall back to a deterministic summary when drafting is unavailable.
- Preview before creation unless `--yes` is used.
- Create a draft pull request with `--draft` or override the target branch with `--base`.
- When an open pull request already exists, publish new commits and offer a refreshed body when needed.

This command mutates GitHub and can invoke the remote rewrite behavior of `kt publish`.

## `kt undo`

- Recover an interrupted land before attempting any other undo.
- When the top commit is a Kite quicksave, remove that commit with a mixed reset and return its changes to the working tree.
- When no quicksave is on top, restore the saves recorded before the latest land.
- Require a clean worktree before undoing a completed land.
- Guard the recorded land target so a rollback cannot reset an unrelated branch or worktree.
- Use a hard reset when restoring pre-land saves.
- Attempt a guarded remote update when undoing a published land on a branch.
- Leave remotes untouched for a detached land.

Undo is destructive history manipulation even when it is intended as recovery. Inspect the target, working tree, rollback state, and remote before running it.

## OpenAI configuration

Kite reads these variables in precedence order:

- Base URL: `KITE_OPENAI_URL`, `KITE_OPENAI_BASE_URL`, `OPENAI_URL`, `OPENAI_BASE_URL`
- Model: `KITE_OPENAI_MODEL`, `OPENAI_MODEL`
- API key: `KITE_OPENAI_API_KEY`, `OPENAI_API_KEY`, `KITE_API_KEY`, `OPENAI_KEY`
- Timeout in seconds: `KITE_OPENAI_TIMEOUT_SECS`

Kite uses the OpenAI Responses API. Keep credentials out of repositories, command output, and documentation examples. Verify current defaults in the installed version instead of depending on a copied model name.

## Preflight commands

```bash
git status --short --branch
git log --oneline -n 12
git remote -v
command -v kt
kt --version
kt <command> --help
```

Before `kt pr`, also run:

```bash
command -v gh
gh auth status
```
