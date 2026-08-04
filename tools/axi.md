# AXI: an agent-interface idea worth exploring

> Status: awareness only, not part of my active toolchain
>
> Last verified: 5 August 2026
>
> Current reference releases: `gh-axi` 0.1.29 and `chrome-devtools-axi` 0.1.28
>
> Sources: [AXI](https://axi.md/), [principles and benchmark source](https://github.com/kunchenguid/axi), [`gh-axi`](https://github.com/kunchenguid/gh-axi), [`chrome-devtools-axi`](https://github.com/kunchenguid/chrome-devtools-axi)

AXI stands for Agent eXperience Interface. It is a set of ten design principles for command-line tools built around how AI agents discover actions, spend context, recover from errors, and verify state. It is primarily an interface design lens, not another agent harness.

I am documenting AXI because the problem is important: giving an agent a tool is not enough if the interface wastes context, hides state changes, requires repeated discovery calls, or fails ambiguously. AXI offers concrete language for evaluating that interface.

I am not claiming that I use AXI today. On the verification date, none of its reference CLIs or skills was installed in my active setup or managed by this handbook. The reference commands on this page come from the official project and were not executed locally. This page is a recommendation to study and evaluate the idea, not an installation claim.

## The design idea

AXI groups its ten principles into three practical concerns.

### Spend context on the task

- Return token-efficient structured output.
- Keep default schemas small.
- Truncate large content with a clear size indicator and an explicit full-output escape hatch.

### Make outcomes unambiguous

- Pre-compute useful aggregates that would otherwise require another call.
- Report definitive empty states rather than silent output.
- Use structured errors, meaningful exit codes, idempotent mutations, and non-interactive commands.

### Help the agent discover the next action

- Offer compact ambient context through an explicit integration.
- Show useful live state when called without arguments.
- Include concrete next-step suggestions in results.
- Provide a consistent, concise help path.

The strongest principle is broader than any one output format: optimize the complete action and observation loop. A compact command that forces three follow-up calls may be worse than a slightly larger response that returns the changed state and the next safe operation.

Source: [the ten AXI principles](https://axi.md/#the-10-principles).

## Why I think it is worth watching

Most agent tools inherit one of two shapes:

- A human-oriented CLI whose prose, prompts, tables, and command hierarchy were not designed for model use.
- A large typed tool surface whose schemas consume context before the model performs any work.

AXI's reference tools sit between those shapes. They keep shell composability while adding structured output, small defaults, explicit errors, combined operations, and contextual guidance. That is aligned with how I want to empower agents: give them interfaces that expose enough state to act independently without filling their context with protocol overhead.

The idea is especially relevant when an agent repeatedly:

- Calls help before every operation.
- Fetches a second snapshot after every mutation.
- Receives far more fields than the task needs.
- Cannot distinguish no results from a failed command.
- Guesses flags that are silently ignored.
- Pulls large logs or payloads into context to find a few useful lines.

AXI gives me a checklist for improving those failure modes even when I never adopt an AXI-branded tool.

## What the published evidence shows

The AXI project publishes two benchmark suites using Claude Sonnet 4.6:

- A browser benchmark with 490 runs across 14 tasks, seven interface conditions, and five repetitions. The project reports 100 percent task success for `chrome-devtools-axi`, with the lowest average cost, duration, and tool-call count in that comparison.
- A GitHub benchmark with 425 runs across 17 tasks, five interface conditions, and five repetitions. The project reports 100 percent task success for `gh-axi`, compared with 86 percent for the raw GitHub CLI and 82 to 87 percent for the tested MCP conditions.

Those results are useful evidence, but they are not a universal verdict. They are project-run benchmarks in two domains, with one model family, a defined task set, and an LLM judge. Another model, task distribution, security requirement, or implementation can change the result. I treat the benchmarks as a strong hypothesis to reproduce on my own work, not proof that every CLI should replace every typed tool.

Sources: [browser study](https://github.com/kunchenguid/axi/blob/main/bench-browser/published-results/report.md), [GitHub study](https://github.com/kunchenguid/axi/blob/main/bench-github/published-results/STUDY.md).

## Reference implementations

The official catalog currently lists four project-maintained examples:

| Tool | Domain | What it demonstrates |
| --- | --- | --- |
| [`gh-axi`](https://github.com/kunchenguid/gh-axi) | GitHub | A compact wrapper around the official GitHub CLI for issues, pull requests, workflows, releases, projects, and related operations. |
| [`chrome-devtools-axi`](https://github.com/kunchenguid/chrome-devtools-axi) | Browser automation | Combined navigation and observation, compact accessibility snapshots, stable element references, and focused extraction. |
| [`lavish-axi`](https://github.com/kunchenguid/lavish-axi) | Human review | A review surface for annotating agent-generated HTML artifacts and returning structured feedback. |
| [`quota-axi`](https://github.com/kunchenguid/quota-axi) | AI usage | Local-first quota and usage data intended to help an agent route work across available providers. |

The catalog also links community projects. Inclusion in a catalog is not a security review or an endorsement. Every wrapper and dependency still needs source, release, and permission review.

Source: [AXI catalog](https://axi.md/#the-axi-catalog).

## Evaluate without adopting

I would not add global packages, session hooks, or permanent skills for an initial evaluation. Start by verifying the exact package metadata:

```bash
npm view gh-axi@0.1.29 version
npm view chrome-devtools-axi@0.1.28 version
```

If the source and package contents are acceptable, the official projects support on-demand execution. Pin the reviewed version rather than asking for whatever `latest` means that day:

```bash
npx -y gh-axi@0.1.29 --version
npx -y chrome-devtools-axi@0.1.28 --version
npx -y chrome-devtools-axi@0.1.28 open https://example.com
```

`npx` downloads and executes package code. A version pin improves reproducibility but does not make the package trustworthy. Run the first evaluation in a disposable environment with no sensitive browser profile, broad credentials, or valuable writable files.

Use the same bounded task with the existing tool and the candidate AXI. Record:

- Task success and correctness.
- Input and output tokens.
- Number of tool calls and recovery turns.
- Wall-clock time and provider cost.
- How clearly mutations are confirmed.
- How much credential, filesystem, and network authority each path receives.
- Whether failures leave enough evidence for the agent to recover.

Adopt only when the improvement is material on the tasks I actually run. A smaller token count is not a win if the wrapper broadens authority, obscures an upstream feature, or adds a maintenance dependency.

Sources: [`gh-axi` 0.1.29](https://github.com/kunchenguid/gh-axi/releases/tag/gh-axi-v0.1.29), [`chrome-devtools-axi` 0.1.28](https://github.com/kunchenguid/chrome-devtools-axi/releases/tag/chrome-devtools-axi-v0.1.28).

## Security boundary

AXI is an ergonomics model, not a sandbox or permission system.

- `gh-axi` wraps an authenticated GitHub client. It can expose every repository or account operation allowed by that authentication, including mutations.
- Browser automation executes actions against web content. Untrusted pages can contain prompt injection and can cause the agent to cross security boundaries if the task and browser environment are not constrained.
- On-demand npm execution introduces package and dependency supply-chain risk.
- Compact output can omit details by design. The `--full` escape hatch and direct verification remain necessary when omitted information could change a decision.
- Contextual next-step suggestions are instructions generated by a tool. The agent should still evaluate scope and authority before following them.
- A wrapper can lag the upstream CLI or protocol. Unsupported or newly added operations may require the original interface.

Use read-only tasks first, constrain credentials to the smallest useful scope, inspect state after every mutation, and keep source control or another recovery mechanism around local changes.

## Update, rollback, and removal

There is no AXI installation in my current setup to maintain. For the pinned on-demand evaluation above:

- Update means reviewing a newer release, changing the explicit version in the command, and rerunning the same benchmark task.
- Rollback means returning to the previously reviewed version in the command.
- Removal requires no global package uninstall because the CLI was not installed globally and no hook or skill was enabled. The package manager may retain an ordinary download cache.

If someone departs from this guide and installs the reference CLIs globally without enabling hooks, remove the global packages with:

```bash
npm uninstall -g gh-axi chrome-devtools-axi
command -v gh-axi
command -v chrome-devtools-axi
```

I do not recommend enabling session hooks during an awareness-only evaluation. The official reference documentation does not currently publish a clear hook-removal workflow, so adding hooks would create cleanup work that this page cannot verify safely.

## When I would not use an AXI

I would keep an existing interface when:

- It already gives the agent reliable, bounded, and compact operations.
- Typed schemas provide important validation and their context cost is immaterial for the task.
- The wrapper does not expose a required upstream feature.
- The task volume is too low to justify another dependency.
- The wrapper's permissions or supply-chain surface are broader than the benefit.
- The published benchmark does not resemble my model, task, or environment closely enough to guide a decision.

For now, AXI belongs in the Handbook as a useful way to think about agent tools and a candidate for measured experiments. It does not belong in the list of tools I claim to use.
