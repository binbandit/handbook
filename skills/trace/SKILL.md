---
name: trace
description: Trace an execution path, request lifecycle, event, data flow, state transition, or user action through a codebase from entry point to exit. Use when the user asks what happens after an action, where data travels, which components participate, why a side effect occurs, or where a flow can fail.
---

# Trace a Flow

Follow the implemented path and distinguish verified behavior from inference.

## Define the boundary

1. Identify the trigger, expected result, and level of detail requested.
2. Read the nearest applicable repository instructions.
3. Locate likely entry points with repository search before reading broad directories.
4. Keep the task read-only unless the user separately asks for a change.

## Follow the implementation

1. Start at the actual entry point, such as a route, command, event handler, scheduled job, or public function.
2. Follow calls, imports, registrations, and configuration in execution order.
3. Track important data shapes and transformations.
4. Mark asynchronous boundaries, queues, callbacks, transactions, caches, network calls, and persistent writes.
5. Follow meaningful success, error, retry, cancellation, and fallback paths.
6. Stop at the requested boundary instead of branching into unrelated internals.
7. Verify dynamic or generated wiring through tests, configuration, or runtime evidence when static code alone is insufficient.

Use `rg` for text and symbol discovery when available. Cite important findings as `path:line`. Never invent a path or line number.

## Report the trace

Include only sections that add value:

- **Entry:** what triggers the flow and where control begins.
- **Sequence:** numbered steps with file references, actions, and data changes.
- **Boundaries:** handoffs to another process, service, queue, store, or UI layer.
- **Branches:** success, failure, retry, and early-exit behavior.
- **Side effects:** writes, messages, network activity, logging, or cache changes.
- **Exit:** final outputs and externally visible results.
- **Evidence gaps:** runtime behavior or configuration that could not be verified.

Add a compact diagram only when several branches or boundaries are easier to understand visually. Label assumptions explicitly and explain how to verify them.
