---
name: commit
description: Prepare and create intentional Git commits from an existing working tree. Use when the user asks to commit changes, split work into atomic commits, stage a logical change, write a Conventional Commit message, or review what should be included before committing.
---

# Create Intentional Commits

Commit only the changes the user authorized, grouped by purpose.

## Inspect before staging

1. Read the repository's applicable instructions and branch rules.
2. Run `git status --short --branch`.
3. Inspect staged and unstaged diffs, including untracked files that may belong to the task.
4. Read recent commit subjects to learn local scope and wording conventions.
5. Separate task changes from unrelated or pre-existing user work.
6. Check for generated files, secrets, credentials, private endpoints, and other material that must not be committed.

Do not mutate the index when the user asks only for a suggested message or commit plan.

## Form logical groups

Group by independently reversible outcome, not by file type. Keep a test, documentation update, migration, or configuration change with the behavior it directly supports. Split unrelated outcomes into separate commits.

Preserve the user's existing staged selection unless changing it is necessary and clearly within scope. Stage explicit paths or selected hunks. Avoid broad staging when it could capture unrelated files.

## Write the message

Use Conventional Commits:

```text
type(optional-scope): imperative summary

Optional body explaining why the change is needed.
```

Choose the narrowest accurate type, such as `feat`, `fix`, `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `perf`, or `revert`. Keep the subject concise, imperative, and free of a trailing period. Add a body only when it explains motivation, tradeoffs, migration, or a non-obvious constraint.

Never identify an AI tool or agent as an author or co-author. Never add a `Co-authored-by:` trailer for an AI tool or agent.

## Verify and commit

For each group:

1. Stage only that group.
2. Review `git diff --cached --stat` and `git diff --cached`.
3. Run `git diff --cached --check` plus the relevant tests and repository checks.
4. Confirm the staged diff contains no secrets or unrelated changes.
5. Create the commit with the selected Conventional Commit message.
6. Recheck `git status --short --branch` and inspect the new commit summary.

Do not bypass hooks unless the user explicitly authorizes it after understanding the failure. If a hook fails, report the error and preserve the useful staged state while fixing only in-scope issues.

Do not push, rewrite existing commits, amend, rebase, or force-update a remote unless the user explicitly requested that operation. Report each commit hash, subject, included scope, validation, and remaining worktree state.
