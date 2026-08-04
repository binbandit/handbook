# Codex: my primary delivery harness

> Status: active use
>
> Last verified: 5 August 2026
>
> Sources: [Codex best practices](https://learn.chatgpt.com/guides/best-practices), [Codex CLI](https://learn.chatgpt.com/docs/codex/cli), [configuration](https://learn.chatgpt.com/docs/config-file/config-basic)

Codex is the primary harness I use to turn an outcome into a tested change. The advantage is not a clever prompt. It is the complete working loop around the model: durable instructions, repository access, bounded tools, live steering, parallel agents, verification, and Git review.

I treat Codex like an engineer operating inside a governed environment. I give it enough authority to complete normal work, a clear definition of done, and a repository contract that tells it how to behave when I am not repeating myself.

## Install the CLI

The desktop app is my richest local surface. The CLI is the portable baseline and the right entry point for a terminal-first setup.

```bash
npm install --global @openai/codex
codex --version
codex
```

Sign in when prompted. An API key is also supported, but interactive ChatGPT sign-in avoids putting a long-lived key in shell configuration.

Update through the same package manager:

```bash
npm install --global @openai/codex@latest
codex --version
```

Source: [Codex CLI](https://learn.chatgpt.com/docs/codex/cli).

## The operating model

My working loop has six stages:

1. State the outcome, constraints, context, and definition of done.
2. Let the agent inspect the repository and form a plan when the task is complex.
3. Give it the tools and permissions needed for the work, no more and no less.
4. Steer with new evidence while it works instead of restarting the task.
5. Require the product's real checks and inspect the diff.
6. Commit and push a coherent result only after the evidence is good.

The prompt begins the job. The environment determines whether the job can finish.

## Prompt for outcomes

I do not spend time inventing ceremonial prompts. I make four things concrete:

```text
Goal: What must be true when this is finished?
Context: Where should the agent look, and what existing behavior matters?
Constraints: What may it change, what must it preserve, and which standards apply?
Done when: Which commands, user flows, or artifacts prove completion?
```

Example:

```text
Add keyboard navigation to the command palette in app/components/CommandMenu.tsx.
Preserve pointer behavior and the current visual language. Follow the repository
instructions. Done when arrow keys wrap, Escape closes, focus returns to the
trigger, focused tests pass, and the production build succeeds. Implement it,
verify it, and report any remaining risk.
```

This is enough structure to reduce ambiguity without dictating the implementation before the agent has inspected the code.

Source: [Prompting](https://learn.chatgpt.com/docs/prompting), [best practices](https://learn.chatgpt.com/guides/best-practices).

## Put durable behavior in `AGENTS.md`

Repeated preferences belong in instructions, not in every prompt.

Codex discovers `AGENTS.md` files from the project root toward the current working directory. A file closer to the work can refine the parent contract. I use that layering sparingly:

- A concise root file defines repository-wide purpose, safety, commands, and quality gates.
- A nested file exists only when a subtree genuinely has different constraints.
- Detailed repeatable procedures live in skills, scripts, or linked documentation.

My portable global contract lives at [`agents/global/AGENTS.md`](../agents/global/AGENTS.md). The reasoning behind its shape lives at [`agents/rationale.md`](../agents/rationale.md).

Why this works:

- The agent receives standards before it starts editing.
- Every engineer and harness can inspect the same public contract.
- The file stays small enough to remain salient.
- Repository facts can evolve with the code that depends on them.

What does not belong there:

- Credentials, internal hostnames, or private paths.
- A full style guide copied from elsewhere.
- Long multi-step workflows that apply only occasionally.
- Temporary task context.
- Rules a test or formatter can enforce more reliably.

Source: [Configure Codex with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [agents.md convention](https://agents.md/).

## Use skills for repeatable procedures

A skill packages a focused workflow in `SKILL.md` with optional scripts, references, and assets. Its description is the routing layer, so I make the trigger conditions explicit and keep the body procedural.

Good skill candidates include:

- Shipping a release with a fixed checklist.
- Auditing a specific class of security issue.
- Generating an artifact that needs a strict render-and-verify loop.
- Operating an external tool with non-obvious guardrails.

I do not create a skill for a one-off instruction or a rule that should always apply. Those belong in the task prompt or `AGENTS.md`.

Source: [Build skills](https://learn.chatgpt.com/docs/build-skills), [skills and plugins](https://learn.chatgpt.com/docs/skills-and-plugins).

## Give the agent real tools

Model quality matters, but tool quality often sets the ceiling. I prefer tools that expose structured, reversible operations and return the evidence needed to verify them.

I add a tool when it gives the agent one of four things:

- Context it cannot obtain safely from the repository.
- An action surface for a system that matters to delivery.
- A deterministic operation that would be fragile to reproduce in prose.
- A verification signal close to the real user outcome.

MCP connects Codex to external systems. Skills teach it when and how to use those systems. Shell commands and repository scripts cover local deterministic work. Browser control is reserved for user-facing paths that cannot be proven from source or an API.

Every added tool expands the trust boundary. I review what it can read, what it can write, how it authenticates, and whether a narrower interface is available.

Source: [Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp), [security](https://learn.chatgpt.com/docs/agent-approvals-security).

## Configure layers, not one giant file

Personal defaults live in `~/.codex/config.toml`. Trusted repositories can add project-scoped `.codex/config.toml` layers, with the nearest layer winning. The desktop app, CLI, and IDE extension share these configuration layers.

I keep the public example intentionally small:

```toml
model_reasoning_effort = "high"
web_search = "live"
```

The source is [`dotfiles/codex/config.toml`](../dotfiles/codex/config.toml), but the Handbook linker does not install it automatically. A real user config often contains provider details, trusted project paths, private MCP endpoints, notifications, and device-specific permissions. Blind replacement would be unsafe.

The rule is:

- Publish portable preferences.
- Keep private providers and machine trust outside the public repository.
- Add project settings only to repositories you trust.
- Copy only the keys you understand from the official sample configuration.

Source: [Config basics](https://learn.chatgpt.com/docs/config-file/config-basic), [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), [sample configuration](https://learn.chatgpt.com/docs/config-file/config-sample).

## Parallelism is decomposition, not duplication

I use subagents when a task contains bounded workstreams that can progress independently: research, a self-contained guide, an isolated component, or an audit. Each assignment gets an owner, output boundary, constraints, and validation target.

I do not send several agents into the same files and hope Git resolves the design. Parallel work is useful when the interfaces are clear. It becomes expensive when every agent needs the same evolving context or their edits overlap.

For code changes that require isolation, Git worktrees give each task its own checkout. For research or read-only analysis, a subagent in the same task is usually enough.

Source: [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees).

## Steer, do not restart

When new information arrives, I send it into the running task. Good steering messages are concrete:

```text
The API response is authoritative. Keep the UI copy, but change the state model
to match `status.kind`. Add a regression test for the stale state you just found.
```

I start a separate task when the outcome is genuinely different, the work needs isolation, or the existing context has become actively misleading. I fork when the shared history is valuable but the next decision needs an alternate path.

One coherent outcome per task makes the final diff and reasoning much easier to review.

## Verification is part of implementation

I tell the agent what evidence completes the work, then expect it to gather that evidence itself:

- Run focused tests while iterating.
- Run the broader project gate before delivery.
- Exercise the real user-facing path when the change depends on runtime behavior.
- Inspect the final diff for accidental edits, generated noise, and secrets.
- Report checks that actually ran, not checks that merely should pass.

For a visual product, a compiler is necessary but insufficient. For a library, a screenshot is irrelevant if the public API is wrong. Verification must match the failure mode.

Source: [Code review](https://learn.chatgpt.com/docs/code-review), [integrated terminal](https://learn.chatgpt.com/docs/integrated-terminal).

## Permissions and security

Permissions are a design decision, not a measure of confidence in the model.

- Start with the smallest writable scope that can complete the task.
- Keep approvals interactive for unusual, destructive, or external actions.
- Treat project-local config, hooks, skills, and tool servers as code.
- Review shell installers before execution in sensitive environments.
- Keep secrets in approved secret stores and environment injection, never in instructions.
- Check the exact target before delete, overwrite, force push, or recursive operations.
- Do not give an untrusted repository permission to redefine the agent's security posture.

Full filesystem access without approvals can be appropriate inside a disposable, isolated environment. It is not a sensible default on a personal workstation.

Source: [Approvals, sandboxing, and security](https://learn.chatgpt.com/docs/agent-approvals-security), [rules](https://learn.chatgpt.com/docs/rules), [hooks](https://learn.chatgpt.com/docs/hooks).

## When I would not use Codex

I would choose a smaller surface when:

- The answer is a stable fact and no repository work is required.
- The task needs a human relationship or decision, not execution.
- The system cannot expose enough context or verification to make autonomous work reliable.
- Policy forbids the required data from entering the configured environment.
- The expected change is too ambiguous to define an outcome without stakeholder input.

The aim is not to use an agent everywhere. It is to remove the distance between a clear intent and a verified result where tools can make that loop dependable.
