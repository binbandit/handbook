# Verification that earns trust

The agent is not finished when the code looks plausible. It is finished when the evidence addresses the ways the change could fail.

## Build an evidence ladder

Use the cheapest signal that can disprove the current idea, then climb toward the user outcome:

1. Static checks: syntax, types, lint, schema validation.
2. Focused tests: the changed behavior and its nearest failure cases.
3. Integration checks: boundaries between components or services.
4. Product path: the actual command, UI flow, install, or deployment behavior.
5. Final diff: scope, safety, secrets, and reviewability.

Running every test after every edit is slow. Running only a unit test before shipping a broken interaction is worse. The ladder keeps feedback fast while still ending at the real surface.

## Match evidence to claims

| Claim | Evidence that supports it |
| --- | --- |
| "The file is valid" | The owning parser or validation command succeeds |
| "The bug is fixed" | A regression test fails before the fix and passes after it |
| "The page works" | The production build succeeds and the real interaction is exercised |
| "The setup is safe" | Preview output, isolated collision test, backup proof, and idempotence |
| "The guide is current" | Primary sources, version output, and a verification date |
| "The change is ready" | Full project gate plus reviewed Git diff |

Do not use a neighboring signal as a substitute. A TypeScript build does not prove keyboard behavior. A screenshot does not prove a data migration is reversible.

## Require failure-path coverage

Happy-path checks are often already represented by the implementation. Spend deliberate effort on:

- Empty and malformed input.
- Missing permissions or authentication.
- Network and process interruption.
- Repeated execution.
- Existing user files and dirty worktrees.
- Narrow viewport, keyboard-only use, and reduced motion.
- Partial state from an older version.

The highest-value test is frequently the one that would have caught the original failure before a customer did.

## Review the repository, not only the patch

Before delivery:

```bash
git status --short --branch
git diff --check
git diff --stat
git diff
```

Also run the repository's secret and generated-file checks. Inspect new dependencies, executable bits, lockfile movement, and untracked artifacts.

If the worktree was already dirty, identify which changes belong to the user and preserve them. A correct feature that destroys unrelated work is not a correct delivery.

## Report evidence precisely

Good:

```text
`npm run check` passed: lint, content links, public-boundary scan, production
build, and 14 tests. The linker also passed preview, apply, and repeat-apply in
an isolated temporary home with a pre-existing target file.
```

Weak:

```text
Everything looks good and tests should pass.
```

If a check could not run, say why, what evidence replaced it, and what risk remains. Transparent limits create more trust than unsupported certainty.
