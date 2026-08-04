---
name: plan
description: Plan a feature, fix, refactor, migration, or other multi-step engineering change before implementation. Use when the user asks for a plan, wants an approach evaluated before code changes, needs scope and risks clarified, or has a complex task that benefits from an implementation sequence and explicit done criteria.
---

# Plan a Change

Build an evidence-based plan that another engineer or agent can execute without rediscovering the problem.

## Establish the task

1. Read the nearest applicable repository instructions.
2. Restate the outcome, affected users, constraints, and done criteria.
3. Separate known facts from assumptions and open questions.
4. Ask a question only when the answer would materially change the approach and cannot be discovered safely.

## Inspect before designing

1. Locate the entry points, existing patterns, tests, configuration, and documentation related to the change.
2. Read the code that owns the behavior instead of planning from names alone.
3. Identify reusable components and current boundaries.
4. Record evidence with file paths and line numbers when it helps the implementer.
5. Keep exploration read-only unless the user also asked for implementation.

## Choose the approach

1. Prefer the smallest end-to-end change that satisfies the requirement.
2. Explain the main design decisions and their tradeoffs.
3. Avoid new abstractions, dependencies, or configuration unless they solve a demonstrated need.
4. Include migration, compatibility, security, and rollback concerns when relevant.
5. State what remains out of scope.

## Produce an executable plan

Scale the detail to the task. Include:

- **Outcome:** one concise description of the intended result.
- **Current state:** the relevant behavior and ownership discovered in the repository.
- **Approach:** the proposed solution and why it fits existing patterns.
- **Changes:** the files or components to create or modify and the purpose of each.
- **Steps:** ordered, independently verifiable implementation units.
- **Verification:** tests, checks, and user-facing behavior that prove completion.
- **Risks and unknowns:** likely failure modes, assumptions, and mitigations.
- **Out of scope:** adjacent work deliberately excluded.

Make each step describe an observable result, not just an activity. Keep the plan concise enough to remain useful during implementation.

When a plan-tracking tool is available, mirror the implementation steps there. Keep only one step in progress at a time and update it as evidence changes.

If the user asked for planning only, stop after the plan. If the user also asked for implementation, begin only after the plan is coherent enough to guide the work.
