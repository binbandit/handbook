# Skills

Skills are the capability layer of Brayden's AI operating system. They package a specialist workflow, its references, deterministic scripts, and verification steps so an agent can load the right knowledge only when a task needs it.

The catalog will grow from actively used, provenance-reviewed skills. Tool-managed system skills, plugin caches, and archived third-party bundles are not copied into this repository.

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
