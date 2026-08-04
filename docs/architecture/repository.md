# Repository architecture

## The product has four layers

```text
Operating model  instructions, context rules, delegation, verification
Capabilities     skills, harnesses, and tools agents can use
Playbooks        complete ways of building, debugging, reviewing, and shipping
Experience       the website that teaches and exposes the canonical sources
```

Portable shell and Git configuration exists only in support of those layers. This repository is not intended to mirror every editor, language, package, or desktop preference.

## Source-of-truth rules

- Agent behavior starts in `agents/` or the nearest repository `AGENTS.md`.
- Repeatable specialist procedures start in `skills/`.
- End-to-end AI working loops start in `playbooks/`.
- Harness and agent-tool guides start in `tools/`.
- The small amount of AI-enabling machine configuration starts in `dotfiles/`.
- Device link intent starts in `setup/links.tsv`.
- Long-form evidence and decisions start in `docs/`.
- Website pages present these sources without becoming a second canonical copy.

## Product journeys

The website should answer these questions in order:

1. What does an AI-first engineering system change?
2. Which harness should I use, and why?
3. What instructions and context should the agent receive?
4. Which tools and skills let it observe, reason, and act?
5. When should work be delegated or kept in one context?
6. How do I verify the result before trusting it?
7. How do I reproduce the useful parts on another device?

Git, GitHub, Fish, and aliases appear inside those journeys as collaboration interfaces for agents, not as standalone tours of a general development environment.

## Growth rules

### Add a harness or agent-facing tool

Create `tools/<slug>.md` with outcome, why Brayden uses it, when to use it, when not to use it, install, configuration, verification, update, rollback, uninstall, security boundary, tested version, and primary sources.

Clearly label whether Brayden actively uses the tool, is experimenting with it, or is sharing it for awareness.

### Add a skill

Create `skills/<harness>/<name>/SKILL.md`. Keep supporting references beside it. Link individual skills if installation is required; never replace an entire harness-managed skill root.

### Add an agent file

Choose its scope first. Global behavior belongs in `agents/global`; repository behavior belongs at that repository root; specialist behavior usually belongs in a skill. Add a harness adapter only if the harness does not natively discover the canonical file.

### Add a playbook

Create one complete loop under `playbooks/`. Begin with the outcome, show how context and tools flow through the work, define stop and escalation points, and finish with observable evidence.

### Add portable configuration

Only add configuration that materially changes how AI work happens. Put the file under `dotfiles/`, add an explicit row to `setup/links.tsv`, and prove that preview, backup, link, and health checks behave safely.

## Public and private composition

The public repository is a safe AI-workflow base. A separate private source owns real work identities, employer services, credentials, device entries, and private model endpoints.

```text
public AI workflow -> private work context -> local credential store -> runtime state
```

Permanent device branches are not part of the design. Real differences become explicit private files. Accidental source differences are resolved through Git. Target collisions are preserved by original path in timestamped backups before linking.

## What is intentionally absent

- A complete editor or desktop setup.
- Language-specific environment tours unrelated to AI workflows.
- Environment files and secret values.
- Agent or terminal transcripts.
- Authentication state.
- Application databases, histories, logs, sockets, and caches.
- Archived third-party skills without license and provenance review.
- Work-specific infrastructure and device identifiers.
