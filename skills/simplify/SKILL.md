---
name: simplify
description: Simplify recently changed code while preserving observable behavior. Use after implementing or reviewing a change when the user asks to reduce complexity, improve clarity, remove unnecessary indirection, align touched code with repository conventions, or make a diff easier to maintain without expanding its scope.
---

# Simplify Changed Code

Improve clarity and maintainability without changing behavior.

## Establish the safe scope

1. Read the nearest applicable repository instructions and configured formatters or linters.
2. Inspect the working-tree and staged diffs to identify recently changed code.
3. Preserve unrelated user changes and generated files.
4. Expand beyond changed code only when the user explicitly requests a broader review or a nearby edit is required for consistency.
5. Identify the tests or checks that define current behavior before editing.

## Simplify deliberately

Apply the repository's own conventions. Prefer changes that:

- reduce unnecessary nesting, branching, duplication, and indirection;
- replace clever expressions with readable control flow;
- improve names so intent is visible without commentary;
- remove redundant wrappers, state, comments, and abstractions;
- keep related logic together while preserving useful boundaries;
- reuse an established local pattern instead of introducing a new one;
- make failure behavior explicit and easy to diagnose.

Keep comments that explain constraints, tradeoffs, or non-obvious reasons. Do not optimize for fewer lines when the result becomes denser or harder to debug.

## Preserve behavior

Do not change public interfaces, outputs, side effects, error semantics, ordering, performance characteristics, or compatibility unless the user authorizes that change. Do not remove code merely because it appears unused when reflection, registration, configuration, or external callers may reach it.

Avoid adding dependencies or abstractions during a simplification pass unless they clearly remove more complexity than they introduce.

## Verify the result

1. Review the final diff for accidental scope or behavior changes.
2. Run the narrowest relevant tests, type checks, formatters, and linters.
3. Compare baseline and final behavior when a reliable fixture or command exists.
4. Revert a simplification that cannot be justified or verified safely.
5. Report the meaningful simplifications, the validation performed, and any remaining uncertainty.
