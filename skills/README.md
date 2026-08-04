# Skills

Skills are the capability layer of Brayden's AI operating system. They package a specialist workflow, its references, deterministic scripts, and verification steps so an agent can load the right knowledge only when a task needs it.

The catalog will grow from actively used, provenance-reviewed skills. Tool-managed system skills, plugin caches, and archived third-party bundles are not copied into this repository.

## Current catalog

| Skill | Purpose | Installed into |
| --- | --- | --- |
| [`commit`](commit/SKILL.md) | Create intentional, atomic Conventional Commits from authorized changes | Codex, Pi, Claude Code |
| [`plan`](plan/SKILL.md) | Turn a complex change into an evidence-based, executable plan | Codex, Pi, Claude Code |
| [`simplify`](simplify/SKILL.md) | Reduce complexity in changed code without changing behavior | Codex, Pi, Claude Code |
| [`trace`](trace/SKILL.md) | Follow an implemented flow from trigger through side effects and exits | Codex, Pi, Claude Code |
| [`use-kite`](use-kite/SKILL.md) | Operate Kite with explicit boundaries around history and remote mutations | Codex, Pi, Claude Code |
| [`use-codex`](use-codex/SKILL.md) | Launch a bounded Codex worker from another harness | Pi, Claude Code |

The portable linker installs each directory individually. It never replaces a harness's entire skill root or its managed system skills.

## Skill contract

Every new skill should have:

- A complete `SKILL.md` with a precise trigger description.
- The smallest set of instructions required for the workflow.
- References loaded only when the main instructions route to them.
- Scripts for deterministic or error-prone mechanics.
- Examples or fixtures for risky parsing and mutation behavior.
- Provenance and license notes when material came from elsewhere.
- A verification path that does not depend on hidden author context.

## What belongs in a skill

Use a skill for multi-step procedures such as product research, browser verification, pull request review, structured debugging, release preparation, or a tool-specific operating workflow.

Do not use a skill for an always-relevant one-line preference, a one-off request, a generated cache, or a rule that belongs in repository instructions or enforceable permissions.

## Curation decisions

These skills were rebuilt from Brayden's existing personal skill sources. They keep the useful workflow while removing harness-specific metadata, stale commands, private assumptions, and duplicated global policy.

Four older candidates were deliberately left out:

- A standalone cleanup skill overlapped `simplify` and made broad deletion too easy to trigger.
- A generic explanation skill did not add enough non-obvious procedure beyond the model's normal capability.
- A large code-quality skill duplicated the global policy and spent task context restating always-relevant principles.
- An older pull request skill relied on brittle command assumptions. The GitHub playbook remains canonical until a current workflow earns a dedicated, forward-tested skill.

More skills are not automatically more capability. Every skill adds routing noise, maintenance cost, and another instruction surface that can influence mutations.
