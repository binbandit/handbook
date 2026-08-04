# Delegation without chaos

Parallel agents are useful when they reduce the critical path. They are expensive when they duplicate orientation, edit the same surface, or produce answers that nobody integrates.

## Decide whether to split

I delegate a workstream when all of these are true:

- It has a concrete output.
- It can make progress without a stream of decisions from the parent task.
- Its write boundary is separate, or the work is read-only.
- I can state how its result will be verified and integrated.

Good examples:

- Research three independent tools from primary sources.
- Audit accessibility while another agent implements server behavior.
- Build an isolated component behind an already-defined interface.
- Investigate two plausible root causes without changing code.

Poor examples:

- Ask three agents to redesign the same page.
- Split a five-line change whose context takes longer to explain than the work.
- Delegate a decision that depends on an unstated product preference.
- Let multiple agents commit or reformat the shared worktree.

## Write a task contract

Every delegated task gets the same compact contract:

```text
Outcome: what you must return or make true.
Scope: files or systems you own, plus explicit exclusions.
Evidence: commands, sources, or user flows that validate the result.
Coordination: dependencies, shared-state warnings, and whether you may commit.
```

Example:

```text
Research the current Pi harness from official sources and the sanitized local
configuration. Write harnesses/pi.md only. Include install, configuration,
extensions, security limits, update, rollback, uninstall, and when not to use it.
Run the content and public-boundary checks. Do not edit other files or commit.
```

The file boundary prevents merge surprises. The evidence boundary prevents a polished but unsupported answer.

## Keep one integrator

One parent task owns the product:

1. Define interfaces and split points.
2. Track which agent owns each output.
3. Continue independent local work.
4. Review returned work against the real repository, not just the agent summary.
5. Resolve inconsistencies and run the complete gate.
6. Commit the integrated milestone.

Subagents can be equally capable, but the parent retains the broader context and the responsibility to reconcile the whole.

## Use isolation when writes overlap

If independent tasks must touch overlapping parts of a repository, give them separate Git worktrees and explicit integration commits. A shared worktree is appropriate only when write ownership is disjoint and every participant knows that it is shared.

Do not treat a merge conflict as a design review. Agree on interfaces before parallel implementation whenever possible.

## Communicate at boundaries

Useful updates are events, not activity logs:

- A new dependency or changed assumption affects another workstream.
- A task is blocked on a real decision.
- A source contradicts the requested behavior.
- A file boundary must change.
- Verification exposed a cross-cutting failure.

Wait quietly while independent work is progressing. Polling every few seconds creates noise without reducing uncertainty.

## Review the result

For each return, I check:

- Does the artifact exist where promised?
- Is it based on the current repository and current primary sources?
- Did the agent stay inside its write boundary?
- Are claims separated from inference and opinion?
- Did the stated validation actually run?
- Does it fit the language and architecture of the whole product?

Delegation is complete only when the result has been integrated and the full system still passes.
