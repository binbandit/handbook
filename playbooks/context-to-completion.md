# Context to completion

This is the default loop I use for meaningful AI work. It turns a vague request into a bounded outcome, keeps the agent moving as evidence changes, and ends with proof instead of confidence theatre.

## 1. Define the finish line

Start with the result, not a list of keystrokes. Include four fields in plain language:

```text
Goal: the outcome that must exist.
Context: the repository, files, symptoms, screenshots, or prior decisions that matter.
Constraints: what may change, what must stay stable, and any safety limits.
Done when: observable evidence that proves the result.
```

If I cannot state what success looks like, I am not ready to delegate the decision. I either investigate with the agent first or speak to the person who owns the requirement.

## 2. Let the agent orient

The first useful action is usually inspection:

- Read the nearest `AGENTS.md` and repository documentation.
- Check the worktree before touching files.
- Trace the user-facing path and identify the source of truth.
- Reproduce the failure or capture the current behavior when practical.
- Identify the narrowest checks that can provide fast feedback.

I want the agent to understand the system before it proposes a rewrite. For a complex task, I ask for a short plan with one active step and observable checkpoints. For a small, obvious change, planning ceremony adds little value.

## 3. Give it the missing capability

When progress stalls, I ask what is actually absent:

- Context: a file, issue, decision, log, or product expectation.
- Access: a repository, service, browser session, or test environment.
- Procedure: a skill, project command, or release playbook.
- Authority: permission for a destructive or external action.
- Decision: a product choice only I or another owner can make.

Better prompting cannot compensate for a missing tool or an unavailable decision. I add the smallest safe capability that unblocks the work.

## 4. Keep the loop alive

I steer a running task when new evidence appears:

```text
The current implementation proves the cache is not the source. Keep the public
API unchanged and trace the invalidation call instead. Add a regression test for
the stale value before changing the implementation.
```

This preserves useful context and avoids paying the orientation cost again. I start a new task only when the outcome has changed, the work needs isolation, or the accumulated context is now misleading.

## 5. Verify at the right layer

Evidence should match the risk:

| Change | Minimum useful evidence |
| --- | --- |
| Pure function | Focused unit test plus type and lint checks |
| API behavior | Contract or integration test with representative failure cases |
| Visual interaction | Runtime exercise of the real flow plus accessibility and responsive checks |
| Configuration | Parser or built-in validation plus a clean-start smoke test |
| Setup script | Preview mode, isolated temporary home, idempotence, and failure-path test |
| Documentation | Copyable commands, link checks, source review, and version date |

The agent should run the checks and report the exact result. "This should pass" is a prediction, not evidence.

## 6. Review the delivery surface

Before a commit, I inspect:

```bash
git status --short
git diff --check
git diff
```

I look for unrelated changes, secrets, generated noise, debug code, accidental dependency growth, and behavior that is not covered by the stated evidence.

Then I create one coherent Conventional Commit and push through the repository's expected workflow.

## 7. Close with useful handoff

A good completion report says:

- What is now true.
- What materially changed.
- Which checks passed.
- What remains risky or deliberately out of scope.
- Where the reviewer should look first.

It does not replay every command. The durable artifacts and Git diff own the implementation history.

## A prompt I actually use

```text
Make the onboarding flow preserve progress after an OAuth callback. Inspect the
current route and session code before choosing an implementation. Do not change
the public callback URL or add a new state store. Done when a new integration
test proves refresh and callback recovery, the existing auth suite passes, the
production build succeeds, and the final diff contains no unrelated formatting.
Implement and verify the change. Pause only if the existing API cannot support
the required behavior safely.
```

The quality comes from a clear result, a capable environment, and a closed verification loop. The prose itself is intentionally ordinary.
