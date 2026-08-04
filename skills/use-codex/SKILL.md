---
name: use-codex
description: Delegate a bounded task from Claude Code or another host harness to the Codex CLI through a thin launcher. Use when the user explicitly asks to use Codex, a host workflow needs a Codex-only capability, an independent Codex implementation or review is useful, or the host's subagent model selector cannot address Codex models directly.
---

# Use Codex from a Host Harness

Launch Codex as the worker and keep the host agent responsible for scope, supervision, and reporting.

## Confirm the boundary

1. Check that `codex` is installed with `command -v codex`.
2. Read the target repository's applicable instructions.
3. Decide whether the task is read-only or requires workspace writes.
4. Confirm that invoking a second harness fits the user's request and available permissions.
5. Keep credentials and private context out of the delegated prompt unless they are essential and explicitly in scope.

Do not pass a Codex model identifier to a host tool whose `model` field accepts only that host's own models.

## Use a thin launcher

When the host supports subagents, choose a fast, economical host model for the launcher. Make the launcher do only four things:

1. Build a self-contained Codex prompt.
2. Run the Codex CLI with the correct working directory and sandbox.
3. Wait or poll until the process exits.
4. Return the exit status, report path, and a faithful summary.

Instruct the launcher not to solve the delegated task itself and not to invent results when Codex fails.

Use worktree isolation for parallel implementation when the host provides it and tasks might touch overlapping files. Read-only investigations usually do not need a worktree.

## Write a self-contained prompt

Include:

- the working directory and relevant repository context;
- one concrete goal;
- constraints and files in scope;
- the permissions and mutation boundary;
- done criteria and required validation;
- the expected report format.

Do not assume Codex can see the parent conversation. Include only the context it needs.

## Choose the Codex mode

Prefer the configured default model unless the task requires a deliberate override. Choose model categories by workload:

- Use a fast, high-throughput model for bounded mechanical changes.
- Use a balanced coding model for ordinary implementation.
- Use the strongest available reasoning and coding model for architecture, difficult debugging, or review.

Use `read-only` for investigation and `workspace-write` for authorized implementation. Avoid unrestricted filesystem access unless the user explicitly requests it and the process is already isolated by a trusted external sandbox.

## Run the CLI

Create a private temporary report path and pass the prompt through standard input when quoting would be fragile.

```bash
report_path="$(mktemp "${TMPDIR:-/tmp}/codex-report.XXXXXX")"
codex exec \
  --sandbox read-only \
  --cd "$PWD" \
  --output-last-message "$report_path" \
  --ephemeral \
  - <<'CODEX_PROMPT'
{self-contained prompt}
CODEX_PROMPT
```

For authorized implementation, change the sandbox:

```bash
codex exec \
  --sandbox workspace-write \
  --cd "$PWD" \
  --output-last-message "$report_path" \
  --ephemeral \
  - <<'CODEX_PROMPT'
{self-contained prompt}
CODEX_PROMPT
```

Add `--model <model>` only when an explicit model choice is necessary. Prefer `--output-schema <schema.json>` when the caller needs machine-readable results.

Use the built-in review mode for repository diffs:

```bash
codex review --uncommitted > "$report_path"
codex review --base main > "$report_path"
codex review --commit <sha> > "$report_path"
```

Do not assume `codex review` accepts every `codex exec` flag. Check the installed command's help before composing version-sensitive invocations.

## Supervise and report

1. Give long-running invocations enough time and poll them without blocking user updates indefinitely.
2. Capture the actual exit status before summarizing.
3. Read the report and inspect any claimed workspace changes.
4. Run host-side verification when the task changed files or the result is consequential.
5. Return the report path, result summary, validation, and remaining uncertainty.

If Codex fails or returns an incomplete result, report that outcome accurately. Retry with a clearer prompt or stronger model category only when doing so remains within the original scope.
