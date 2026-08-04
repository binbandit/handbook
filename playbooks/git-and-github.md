# Git and GitHub as agent infrastructure

I do not optimize Git for typing fewer characters. I optimize it for giving people and agents a clean state model, reversible checkpoints, and a reviewable delivery path.

## Start with a legible repository

Before work begins:

```bash
git status --short --branch
git remote -v
git log --oneline -5
```

This tells the agent which branch it is on, whether local work already exists, where a push would go, and how the project describes recent changes.

Never assume a dirty file belongs to the current task. Inspect it and work around it. Do not use destructive reset or checkout commands to make the status look clean.

## Make commits explain outcomes

I use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```text
feat: add resumable agent sessions
fix: preserve setup backups by source path
docs: explain the Pi extension trust boundary
```

The type helps machines and people classify the change. The description says what became true. One coherent commit is easier for an agent to review, revert, bisect, and reuse than a pile of incidental checkpoints.

Before committing:

```bash
git diff --check
git diff --stat
git diff
git status --short
```

Stage intentionally, review the staged diff, run the project gate, then commit. Never put credentials, auth state, or machine-specific private paths into Git history.

## Use branches according to the repository

This Handbook is intentionally maintained directly on `main`. That is a repository rule, not a universal recommendation.

For a team repository, short-lived branches and pull requests are usually the right review boundary. For parallel local agent work, use worktrees so each branch has a separate checkout:

```bash
git fetch origin
git worktree add ../project-fix -b fix/session-recovery origin/main
```

Keep branch ownership explicit. Do not let two agents rewrite the same branch or force push over each other's work.

## Give the agent GitHub context

Install and authenticate the GitHub CLI:

```bash
brew install gh
gh auth login
gh auth status
```

Useful read-only context:

```bash
gh repo view
gh issue view 123 --comments
gh pr view 456 --comments
gh pr checks 456
```

The agent should read the issue, current diff, review comments, and CI evidence before changing code. A ticket title alone rarely contains the contract.

Use GitHub mutations only when they are part of the requested workflow. Creating an issue, replying to a reviewer, merging, or changing labels affects other people and should be deliberate.

## Build pull requests for review

A strong pull request contains:

- The user or system outcome.
- The important design choice and why it was chosen.
- Exact validation that ran.
- Screenshots only when they materially help review a visual change.
- Known limits or follow-up work.

Avoid a transcript of implementation steps. The diff already contains the mechanics.

Ask the agent to review the PR as a skeptical maintainer. Useful review prompts name the risk:

```text
Review this diff for behavior regressions, unsafe filesystem operations,
unhandled partial state, and tests that pass without exercising the changed
path. Report only actionable findings with file and line references.
```

## Aliases worth keeping

Aliases should expose frequent state or make a safe operation easier to remember. My portable set lives in [`dotfiles/gitconfig`](../dotfiles/gitconfig) and the Fish abbreviations live in [`dotfiles/config/fish/conf.d/10-abbr.fish`](../dotfiles/config/fish/conf.d/10-abbr.fish).

Examples:

```bash
git st      # short status
git lg      # compact decorated history
git last    # latest commit and file statistics
git restore --staged <path> # unstage without discarding edits
```

I avoid aliases that hide a destructive command, silently force push, or make a multi-step mutation look harmless. Agents can type the long command. Clarity is more valuable than saving six characters.

## Keep the final state boring

At handoff, the branch should have no unexplained files, CI should reflect the current commit, and the reviewer should be able to understand the result from the commit, pull request, tests, and source.

Git is the shared memory of the work. Treat it as part of the agent system, not an afterthought once the code is written.
