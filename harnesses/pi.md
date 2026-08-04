# Pi: the harness I reshape around the work

> Status: active use
>
> Last verified: 5 August 2026
>
> Current release and installed version: Pi 0.83.0
>
> Runtime requirement: Node.js 22.19.0 or newer
>
> Sources: [Pi](https://pi.dev/), [official documentation](https://pi.dev/docs/latest), [v0.83.0 release](https://github.com/earendil-works/pi/releases/tag/v0.83.0), [source repository](https://github.com/earendil-works/pi)

Pi is the terminal agent harness I use when I want to shape the agent loop around the work instead of accepting a fixed product workflow. The core gives a model file, edit, and shell tools; persistent tree-structured sessions; model switching; context compaction; and interactive, print, JSON, RPC, and SDK modes. Skills, TypeScript extensions, prompt templates, and packages supply the rest.

That small core is the reason I use Pi. I can decide which instructions enter context, which tools the model can call, which provider should handle a task, how work is delegated, and how noisy evidence is compressed. Pi is not my entire development environment. It is one of the harnesses through which I give AI useful context and controlled access to the work.

Sources: [Pi overview](https://pi.dev/), [using Pi](https://pi.dev/docs/latest/usage), [sessions](https://pi.dev/docs/latest/sessions), [compaction](https://pi.dev/docs/latest/compaction).

## When I use Pi

Pi is a good fit when:

- I want a terminal-first agent that remains understandable and inspectable.
- I need to switch providers, models, or reasoning levels without changing harnesses.
- A task benefits from a specialist skill or a purpose-built tool exposed by an extension.
- I want to steer a running agent, queue a follow-up, branch an earlier point in a session, or resume later.
- I need a one-shot command, a JSON event stream, RPC integration, or an embeddable SDK in addition to the interactive interface.
- I am prepared to own the trust and maintenance decisions created by third-party extensions.

For a short, ordinary task, a less customized harness may be simpler. Pi becomes most valuable when the harness itself is part of the system I am designing.

## Install

Pi 0.83.0 is the current official release and the version installed on my machine. Its package declares Node.js 22.19.0 or newer. I prefer the explicit npm package because the version is visible, reviewable, and easy to restore.

Inspect the package metadata, install the reviewed version, and verify the executable:

```bash
node --version
npm view @earendil-works/pi-coding-agent@0.83.0 version engines
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.83.0
pi --version
```

Expected Pi version:

```text
0.83.0
```

`--ignore-scripts` disables dependency lifecycle scripts. Pi's official documentation says normal npm installs do not require them.

Sources: [quickstart](https://pi.dev/docs/latest/quickstart), [v0.83.0 package metadata](https://github.com/earendil-works/pi/blob/v0.83.0/packages/coding-agent/package.json).

## Authenticate without publishing secrets

My default provider is `openai-codex`, authenticated through Pi's interactive subscription login. Start Pi, then run:

```text
/login
```

Choose ChatGPT Plus/Pro (Codex) and complete the browser flow. Pi stores OAuth credentials in `~/.pi/agent/auth.json`, creates that file with mode `0600`, and refreshes supported tokens when required. The provider and model names are safe configuration. The token file is not.

For an API-key provider, inject the documented environment variable from a credential manager before starting Pi, or use `/login` to store the key in Pi's local auth file. Never put a real key in:

- This repository or another public repository.
- `AGENTS.md`, `SYSTEM.md`, project settings, a prompt template, or a skill.
- A shell command checked into a script.
- `--api-key` in reusable instructions, where it may be exposed through shell history or process inspection.

Use `/logout` to remove a provider credential from Pi. Do not copy `auth.json` into a device setup repository or backup location that is not protected as secret material.

List the locally known models without changing files:

```bash
pi --offline --list-models openai-codex
```

An optional end-to-end provider check consumes provider quota but disables tools, extensions, skills, templates, themes, context files, and session persistence:

```bash
pi --no-tools \
  --no-extensions \
  --no-skills \
  --no-prompt-templates \
  --no-themes \
  --no-context-files \
  --no-session \
  -p "Reply exactly with: pi-ok"
```

Sources: [providers](https://pi.dev/docs/latest/providers), [model catalog](https://pi.dev/models).

## My current configuration

Pi reads global settings from `~/.pi/agent/settings.json` and project overrides from `.pi/settings.json`. This is the safe, curated part of my current global configuration:

```json
{
  "defaultProvider": "openai-codex",
  "defaultModel": "gpt-5.6-sol",
  "defaultThinkingLevel": "high",
  "packages": [
    "npm:@hypabolic/pi-hypa",
    "npm:pi-web-access",
    "npm:pi-mcp-adapter",
    "npm:pi-subagents"
  ]
}
```

The choices are intentional:

- `openai-codex` uses subscription login, keeping a literal API key out of the configuration.
- `gpt-5.6-sol` is my default for demanding engineering work. It is a preference, not a requirement, and I switch models when cost, latency, or task shape calls for something else.
- `high` reasoning spends more time on hard problems. I lower it for routine or latency-sensitive work.
- The package list adds research, context control, compatibility, and delegation capabilities that Pi deliberately leaves outside its minimal core.
- I leave `defaultProjectTrust` unset, which retains Pi's upstream default of `ask` rather than trusting project resources globally.

I do not publish the live settings file wholesale. A live file can accumulate private paths, provider details, or future values that do not belong in a public handbook.

Pi also loads behavioral context from:

- `~/.pi/agent/AGENTS.md` for global instructions.
- `AGENTS.md` or `CLAUDE.md` in parent directories and the current project.
- `.pi/SYSTEM.md` to replace the default system prompt, or `.pi/APPEND_SYSTEM.md` to append project-specific system context.

Context files describe how the agent should work. Settings and extensions determine what the harness loads and can do. Keeping those roles separate makes both easier to audit.

Reload changed settings, instructions, skills, templates, and extensions with:

```text
/reload
```

Sources: [settings](https://pi.dev/docs/latest/settings), [context files](https://pi.dev/docs/latest/usage#context-files).

## The capability layer I give Pi

These are third-party packages, not features maintained as part of Pi core. The versions below are the versions observed on my machine on the verification date. My current settings identify the package sources without version suffixes, so this table records machine state rather than promising reproducible package resolution.

| Package | Observed version | Why I use it |
| --- | ---: | --- |
| [`@hypabolic/pi-hypa`](https://github.com/Hypabolic/Hypa/tree/main/packages/pi-hypa) | 0.1.12 | Compress noisy command output before it consumes model context while retaining recoverable evidence. |
| [`pi-web-access`](https://github.com/nicobailon/pi-web-access) | 0.13.0 | Give Pi web search and content extraction for research tasks. |
| [`pi-mcp-adapter`](https://github.com/nicobailon/pi-mcp-adapter) | 2.11.0 | Reach selected MCP servers when an existing integration is useful, without making that protocol the shape of Pi core. |
| [`pi-subagents`](https://github.com/nicobailon/pi-subagents) | 0.34.0 | Delegate bounded work into separate agent contexts and collect results back into the main task. |

Pi's extension system has three useful layers:

| Layer | What it contributes | Trust implication |
| --- | --- | --- |
| Skill | On-demand instructions, scripts, and references for a specialist capability | Can direct the model to take actions and may include executable helpers |
| Extension | TypeScript code that can add tools, commands, events, providers, context, and interface elements | Executes with the same operating-system permissions as Pi |
| Package | An npm or Git bundle containing extensions, skills, prompts, or themes | Inherits the risks of every bundled resource and its dependencies |

I review source and release changes before installing any of them. The package catalog is discovery, not an endorsement.

Try a package for one process without adding it to settings:

```bash
pi -e npm:pi-web-access
```

This is temporary installation, not isolation. The package still executes with Pi's full process permissions.

Install a reviewed package persistently, inspect the configured package sources, and selectively enable resources:

```bash
pi install npm:pi-web-access
pi list
pi config
```

Project-local packages use `-l` and enter the project trust boundary. Exact npm versions can be included in a source such as `npm:pi-web-access@0.13.0`. Pi skips exact version specifications during package updates, which is useful when reproducibility matters more than automatic movement.

Sources: [extensions](https://pi.dev/docs/latest/extensions), [skills](https://pi.dev/docs/latest/skills), [Pi packages](https://pi.dev/docs/latest/packages), [package catalog](https://pi.dev/packages).

## How I work in Pi

Start Pi in the repository that owns the task:

```bash
cd /path/to/project
pi
```

The current working directory is part of the authority boundary. I give Pi a specific repository, clear project instructions, and a concrete outcome rather than starting it from a broad parent directory.

Useful interaction patterns:

- Type `@` to attach a relevant file instead of pasting an entire tree into context.
- Use `/model` or `Ctrl+L` when another model is a better fit.
- Press Enter while Pi is working to steer the active turn after its current tool call. Use `Alt+Enter` to queue a follow-up for after the task.
- Use `/tree` to return to an earlier point and explore another path without losing the existing branch.
- Use `/compact` when the active context needs a deliberate summary.
- Use `pi -c` to continue the most recent session and `pi -r` to choose an older one.
- Use `pi --no-session` for work that should not be saved under `~/.pi/agent/sessions/`.
- Use `pi -p "request"` for a bounded one-shot task and `--mode json` or `--mode rpc` for process integration.

The model receives four built-in tools by default: `read`, `write`, `edit`, and `bash`. I treat every tool result as evidence to inspect, not proof that the requested outcome happened. Tests, diffs, command exit status, and direct observation still decide whether the work is complete.

## Security boundary

Pi does not have a built-in sandbox or permission system. This is the most important fact on this page.

Built-in tools can read, write, edit, and execute commands with the permissions of the user who launched Pi. Extensions are ordinary TypeScript modules with the same permissions. Project trust only decides whether Pi loads project-local settings, packages, prompts, skills, themes, and extensions. It does not restrict what an already-running model or tool can access.

Additional limits matter:

- `AGENTS.md` and `CLAUDE.md` context files load regardless of project trust unless context loading is disabled.
- A skill can contain persuasive instructions or executable helpers even though it is loaded on demand.
- A package installed for one process with `-e` still has full process access.
- `--tools read,grep,find,ls` removes built-in write and shell tools, but it is an allowlist, not an operating-system boundary. Read tools can still reach files the user can read.
- A read-write container mount can still change host files.
- Routing built-in tools into an isolated environment does not automatically isolate unrelated extension tools running in the host Pi process.

For an untrusted repository, unattended work, or generated code I will not monitor closely, I run Pi inside a container, virtual machine, micro-VM, remote sandbox, or policy-controlled sandbox. I mount only the required workspace, pass only the minimum required credentials, restrict network access when practical, and review outputs before bringing them back into a trusted environment.

Use a built-in read-only tool set for lower-risk review work:

```bash
pi --tools read,grep,find,ls -p "Review this repository without changing it"
```

Use `--no-context-files` when repository instructions themselves are untrusted, and `--no-approve` when project-local Pi resources should not load for that run. Neither flag creates a sandbox.

Sources: [security](https://pi.dev/docs/latest/security), [containerization](https://pi.dev/docs/latest/containerization).

## Update safely

Pi can update its own CLI, packages, and model catalog independently. I keep those changes separate so a model-catalog refresh does not become an unreviewed extension upgrade.

Inspect the installed and available core versions first:

```bash
pi --version
npm view @earendil-works/pi-coding-agent version
```

Read the [release notes](https://github.com/earendil-works/pi/releases), especially breaking changes for extensions. Then either install an explicit reviewed version:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.83.0
```

Or intentionally move the CLI to the latest release:

```bash
pi update --self
```

Update the model catalog without changing the CLI or packages:

```bash
pi update --models
```

Review and update third-party packages one at a time. `pi update --extensions` updates every unpinned package and is therefore a broader change than its name may suggest.

After any update:

```bash
pi --version
pi --offline --list-models openai-codex
pi list
```

Start a short session, confirm the expected model, and exercise each extension's smallest read-only path before trusting it with a mutation.

## Roll back

Record the working version before an update. To restore the currently documented Pi release:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.83.0
pi --version
pi list
```

An older core may be incompatible with a newer extension or session format. Review both release notes, restore package versions that were known to work with the core, and test with a fresh session before reopening important saved work.

To roll back a package, remove its unversioned source, install the known-good exact version, and confirm it with `pi list`. For example, this restores the observed `pi-web-access` version from this page:

```bash
pi remove npm:pi-web-access
pi install npm:pi-web-access@0.13.0
pi list
```

Do not restore `auth.json` from an unprotected backup. Any backup containing `~/.pi/agent` includes credentials, sessions, and potentially sensitive prompts, so it must be protected as secret material.

## Uninstall

Inspect installed packages before removing Pi:

```bash
pi list
npm uninstall -g @earendil-works/pi-coding-agent
command -v pi
```

If the goal is to remove the package configuration as well as the CLI, remove each package source while Pi is still available:

```bash
pi remove npm:@hypabolic/pi-hypa
pi remove npm:pi-web-access
pi remove npm:pi-mcp-adapter
pi remove npm:pi-subagents
pi list
```

Then uninstall the core package with the npm command above.

If `command -v pi` still prints a path, another installation owns that executable and should be investigated separately.

Removing the package does not delete `~/.pi/agent/`. Settings, credentials, sessions, trust decisions, downloaded package data, and other local state remain available for recovery. If a complete reset is intentional, stop Pi and move the directory to a protected, recoverable location first:

```bash
mv ~/.pi/agent ~/.pi/agent-retired-20260805
```

Treat the retired directory as secret material. Delete it permanently only after checking that no credentials, sessions, or configuration are needed for recovery.

Source: [quickstart uninstall guidance](https://pi.dev/docs/latest/quickstart#uninstall).

## When I would not use Pi

I would choose another harness or a stronger execution boundary when:

- Built-in permission prompts or a hard sandbox are requirements.
- I cannot review and maintain the extension code needed for the workflow.
- The task should not have access to my user account's files, processes, network, or credentials.
- A managed graphical workflow is more important than terminal control and extensibility.
- The work is too small to justify a customized harness and package layer.

Pi gives me leverage because it is malleable. That same quality means I am responsible for what I load into it and where I let it run.
