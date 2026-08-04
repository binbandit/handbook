# Kite

Kite is the Git layer I give coding agents when I want them to move quickly without leaving disposable history behind. The `kt` command makes cheap local checkpoints while work is in progress, then uses AI to turn the checkpoint stack into reviewable commits and a well-formed pull request.

This is not a general Git replacement. It solves one narrow problem in an AI workflow: agents should be able to save progress without stopping to invent a permanent commit structure, while people should still receive a clean history that explains the finished work.

## Why it belongs in the AI harness

An agent often learns the real shape of a change while implementing it. Asking for perfect commit boundaries up front interrupts that work and encourages large, vague commits. Kite separates capture from explanation:

1. `kt` records fast `[kite] save` checkpoints.
2. `kt land` sends the saved diff and recent repository commit style to the configured model.
3. The model groups changes at hunk level and proposes commit messages.
4. Kite previews the plan and verifies that replaying it reproduces the saved tree exactly.
5. `kt pr` uses the same AI connection to draft or refresh the pull request, while respecting repository templates and relevant agent skills.

The model proposes organization and language. Git remains the source of truth, and Kite checks that the proposed history preserves every saved change.

## Current setup

Verified on 5 August 2026:

- `kt` is installed at `~/.cargo/bin/kt` and reports `kt 0.1.0`.
- Cargo records it as package `kite v0.1.0`, installed from a local source checkout.
- The current shell already supplies `OPENAI_URL`, `OPENAI_MODEL`, and `OPENAI_API_KEY`. Their values were not printed or copied.
- No `KITE_OPENAI_*` override was present, so Kite currently inherits those general AI settings by its documented precedence.
- GitHub CLI `2.97.0` is installed and authenticated, which satisfies the local prerequisite for `kt pr`.
- The optional `use-kite` agent skill is not currently installed at project or user scope.

The public repository has no tags or packaged releases. Its `main` branch currently points to [`69f7536516597c05099175fc18eaadbe5c878c00`](https://github.com/binbandit/kite/commit/69f7536516597c05099175fc18eaadbe5c878c00), committed on 27 July 2026, while the package manifest still reports `0.1.0`. Record the source commit as well as `kt --version` because the version alone does not identify the installed revision.

## Install

Kite is built from source and requires Rust with Cargo. The repository documents a source checkout followed by `cargo install --path .`. I add `--locked` so Cargo uses the repository's committed dependency versions.

```bash
git clone https://github.com/binbandit/kite.git
cd kite
git rev-parse HEAD
cargo install --locked --path .
```

For a revision-pinned install without keeping a checkout:

```bash
cargo install --locked \
  --git https://github.com/binbandit/kite.git \
  --rev 69f7536516597c05099175fc18eaadbe5c878c00 \
  kite
```

Install the shipped skill when an agent should understand Kite's commands and action boundaries:

```bash
npx skills add https://github.com/binbandit/kite \
  --skill use-kite \
  --agent codex \
  --global
```

The skill tells an agent to inspect repository state first, prefer checkpoints over throwaway manual commits, and treat landing, publishing, pull requests, and undo as progressively higher-impact operations.

## Configure the AI connection

Kite has no dedicated configuration file. `kt land` and `kt pr` read environment variables and call an OpenAI Responses API compatible endpoint.

| Setting | Precedence | Default |
| --- | --- | --- |
| Base URL | `KITE_OPENAI_URL`, `KITE_OPENAI_BASE_URL`, `OPENAI_URL`, `OPENAI_BASE_URL` | `https://api.openai.com/v1` |
| Model | `KITE_OPENAI_MODEL`, `OPENAI_MODEL` | `gpt-5.4-mini` |
| API key | `KITE_OPENAI_API_KEY`, `OPENAI_API_KEY`, `KITE_API_KEY`, `OPENAI_KEY`, `AI_GATEWAY_API_KEY` | none |
| Timeout | `KITE_OPENAI_TIMEOUT_SECS` | 120 seconds |

Prefer the `KITE_OPENAI_*` names when Kite should use a different model or endpoint from the rest of the AI harness. Inject the key at process launch from a secret manager. Never place it in this repository, a committed shell file, command history, or an example with a real value.

Check only whether supported variables are present, without printing their values:

```bash
for variable in \
  KITE_OPENAI_API_KEY OPENAI_API_KEY KITE_API_KEY OPENAI_KEY \
  AI_GATEWAY_API_KEY KITE_OPENAI_URL OPENAI_URL \
  KITE_OPENAI_MODEL OPENAI_MODEL KITE_OPENAI_TIMEOUT_SECS
do
  if printenv "$variable" >/dev/null; then
    printf '%s is set\n' "$variable"
  fi
done
```

Kite normalizes compatible base URLs before appending `/responses`. A base ending in `/responses` or `/chat/completions` is reduced to the service root, and `/v1` is added when absent.

If the AI call fails, landing does not silently invent a plan. Kite displays the provider error and asks for one manual commit message before changing history. A new pull request falls back to a deterministic draft based on the branch commits and available template.

## Verify the installation

The CLI uses `--version`; there is no `kt version` subcommand.

```bash
command -v kt
kt --version
kt --help
kt land --help
kt pr --help
```

Before using pull request support:

```bash
command -v gh
gh auth status
```

There is no `doctor` or read-only AI connectivity command. Test the full AI path in a throwaway repository containing non-sensitive sample changes before relying on a new endpoint or model in important work.

## The working loop

Start every agent operation with a small preflight:

```bash
git status --short --branch
git log --oneline -n 12
git remote -v
command -v kt
```

Then use the narrowest command that matches the intent.

| Intent | Command | Effect |
| --- | --- | --- |
| Start or resume a permitted flow branch | `kt go <name>` | Switches to an existing local or remote branch, or creates one from the default branch |
| Checkpoint current work | `kt` | Creates a local `[kite] save` commit |
| Turn checkpoints into reviewable history | `kt land` | Previews and locally rewrites contiguous Kite saves |
| Publish reviewed history | `kt publish` | Pushes the current branch and rewrites its remote history only when required |
| Draft a pull request | `kt pr` | Publishes if needed, drafts with AI, previews, then creates through `gh` |
| Reverse the last Kite action | `kt undo` | Uncommits the top save, or restores the pre-land history |

`kt go` is optional. This repository's policy requires work on `main`, so agents must not use it here unless that policy is explicitly changed.

### 1. Checkpoint without breaking flow

```bash
kt
```

If changes are already staged, Kite saves only that deliberate selection. Otherwise it runs `git add -A`, including tracked and untracked changes, then commits with a timestamped `[kite] save` message. A clean worktree is a safe no-op.

Checkpoint commits skip Git hooks to stay fast. That is useful during agent work, but it makes the preflight important: inspect untracked files and never let credentials, local state, generated output, or unrelated user work enter a checkpoint.

### 2. Validate before synthesis

Run the repository's tests and content gates before asking AI to organize the work. Kite preserves the tree, but clean commit boundaries do not make incorrect code correct.

```bash
npm run check
git status --short --branch
```

### 3. Land the checkpoint stack

```bash
kt land
```

Kite considers only contiguous `[kite] save` commits at the top of the current branch. It groups the diff at hunk level, uses recent non-Kite commit messages as style examples, and shows the proposed commits before rewriting history. Normal commit hooks run while the landed commits are created.

Useful options exist, but they should not be an agent's default:

- `kt land --allow-dirty` temporarily stashes and restores unsaved work.
- `kt land --yes` skips the rewrite confirmation.
- `kt land --push` lands and immediately publishes.

The safer agent path is a clean worktree, a visible plan, and separate publish approval.

After landing, inspect and test again:

```bash
git log --oneline -n 12
git status --short --branch
npm run check
```

### 4. Publish only after review

```bash
kt publish
```

Kite fetches the current branch first. It performs a normal fast-forward push when possible. If publishing would discard remote commits, Kite distinguishes old Kite saves from other commits and asks before dropping work that is not part of the rewritten save stack.

Publishing is an external write and can require a guarded force push. An agent should run it only when the user has explicitly asked to publish.

### 5. Draft the pull request

```bash
kt pr
```

Kite refuses unlanded saves, publishes the branch when needed, and asks AI to draft a title and body. It reads the branch commits and diff, a repository pull request template, recent merged pull request titles, and relevant project or user agent skills. It previews the result before calling `gh pr create`.

Useful variants are:

```bash
kt pr --draft
kt pr --base release/1.2
```

Avoid `kt pr --yes` in normal agent operation. It removes the final confirmation before an external write. When a pull request is already open, `kt pr` can also push new commits and offer to refresh the existing title and body.

## What leaves the machine

The Git operations are local until publish or pull request creation, but AI synthesis sends repository context to the configured endpoint.

For `kt land`, that context includes:

- The aggregate diff introduced by the Kite saves, divided into labeled hunks.
- Recent non-Kite commit messages used as style examples.

For `kt pr`, it can also include:

- Commits and diff between the base branch and `HEAD`.
- The repository pull request template.
- The contents of relevant pull request agent skills.
- Recent merged pull request titles.
- The current pull request title and body when deciding whether an open request is stale.

Do not use AI synthesis on code or metadata that the selected provider is not approved to receive. Check repository skills and templates before using `kt pr` in an unfamiliar checkout because they become model instructions and prompt context.

## Safety boundaries for agents

Use this authority ladder:

1. Read-only preflight commands are always the starting point.
2. `kt` is a local checkpoint, but it can stage everything and bypasses hooks.
3. `kt land` rewrites local history and requires the work to be ready for review.
4. `kt publish` can rewrite remote history and needs explicit publish intent.
5. `kt pr` can publish, create, or edit external review state and needs explicit intent.
6. `kt undo` can hard-reset and force-push after a land, so use it only for an explicit reversal request.

Additional guarantees and limits:

- Landing requires an existing commit, a branch, and a clean worktree unless `--allow-dirty` is supplied.
- Landing rewrites only the contiguous Kite saves at the top of first-parent history.
- The proposed hunk plan is replayed in a temporary index and must reproduce the saved tree exactly. Kite falls back to whole-file grouping if that proof fails.
- Binary files, renames, and mode changes remain whole units.
- Large change sets may be grouped by file when there is too much hunk content for a reliable prompt. Smaller, focused landing sessions produce better plans.
- A successful land records the former `HEAD` at `refs/kite/pre_land` plus repository-local ownership metadata for undo.
- A later land replaces the repository's previous rollback marker. Treat `kt undo` as one-step recovery, not a permanent archive.
- Failed or interrupted landing attempts restore the original branch and save stack before a later Kite command proceeds.
- Unresolved merge conflicts are not valid checkpoint or landing input.

## Undo and version rollback

`kt undo` reverses workflow state, not the installed program version.

If the top commit is a Kite save, undo uses a mixed reset so the saved changes return to the worktree and newer edits remain. If there is no top save, it can undo the last land by hard-resetting to `refs/kite/pre_land`. Undoing a land requires a clean worktree, refuses to target the wrong branch, and may force-push the restored history when a remote exists.

```bash
git status --short --branch
git log --oneline -n 12
kt undo
git status --short --branch
git log --oneline -n 12
```

To roll the installed program back to a known source revision without changing a working checkout:

```bash
cargo install --locked --force \
  --git https://github.com/binbandit/kite.git \
  --rev <known-good-commit> \
  kite

kt --version
```

Record `<known-good-commit>` in the change log or setup record because several source revisions may report the same package version.

## Update

There is currently no packaged release channel. Update the source checkout only after reviewing its state and the incoming commits:

```bash
cd kite
git status --short
git fetch origin
git log --oneline HEAD..origin/main
```

Stop if the checkout has local changes. Once it is clean and the incoming range is understood:

```bash
git merge --ff-only origin/main
cargo install --locked --path .
git rev-parse HEAD
kt --version
```

Verification should include both the commit and CLI version. Do not treat another `0.1.0` result as proof that nothing changed.

Update the agent skill separately when it is installed:

```bash
npx skills update use-kite --global --yes
```

## Uninstall

Remove the Cargo-installed binary:

```bash
cargo uninstall kite

if command -v kt >/dev/null; then
  printf 'kt is still present at %s\n' "$(command -v kt)"
  exit 1
else
  printf 'kt removed\n'
fi
```

If the optional global agent skill was installed, remove it separately:

```bash
npx skills remove use-kite \
  --agent codex \
  --global \
  --yes
```

Uninstalling the binary does not delete a source checkout, environment variables used by other AI tools, or per-repository rollback metadata. Review a source checkout with `git status --short` before deciding whether to remove it. Keep `refs/kite/pre_land` until any final undo decision has been made.

## When not to use Kite

Choose a simpler or more controlled path when:

- The repository or branch forbids history rewriting or is shared by several people.
- The configured AI provider is not approved to receive the diff, commit metadata, templates, or skill content.
- The worktree contains secrets, unrelated user changes, large generated artifacts, or unreviewed untracked files.
- Every intermediate checkpoint must pass hooks or be independently buildable.
- A merge or rebase is unresolved.
- `HEAD` is detached and the intended action is land, publish, or pull request creation in the public `0.1.0` behavior.
- The repository has no initial commit.
- The change is already one small logical commit and manual Git is clearer.
- The diff is so large and mixed that file-level grouping would hide important intent. Split the work or land smaller stacks instead.

Kite is most useful when agents make many exploratory edits, checkpoints are cheap, the final review history matters, and the user retains explicit control over rewrite and publish steps.

## Primary sources

Accessed 5 August 2026:

- [Kite README at the current public commit](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/README.md)
- [Package manifest and version](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/Cargo.toml)
- [CLI entry point and checkpoint behavior](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/src/main.rs)
- [AI configuration and Responses API client](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/src/ai.rs)
- [Landing, publishing, recovery, and undo implementation](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/src/land.rs)
- [Pull request context, skill discovery, preview, and creation](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/src/pr.rs)
- [Shipped `use-kite` agent skill](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/skills/use-kite/SKILL.md)
- [Detailed CLI behavior reference](https://github.com/binbandit/kite/blob/69f7536516597c05099175fc18eaadbe5c878c00/skills/use-kite/references/cli-behavior.md)
- [Current public commit](https://github.com/binbandit/kite/commit/69f7536516597c05099175fc18eaadbe5c878c00)
- [Release status](https://github.com/binbandit/kite/releases)
- [Tag status](https://github.com/binbandit/kite/tags)
