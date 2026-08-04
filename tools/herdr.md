# Herdr: the control plane for my AI agents

> Status: active use
>
> Last verified: 5 August 2026
>
> Stable release: Herdr 0.8.0, protocol 19
>
> Sources: [Herdr](https://herdr.dev/), [release manifest](https://herdr.dev/latest.json), [official documentation](https://herdr.dev/docs/)

Herdr is the terminal control plane I use when AI work fans out across several agents. Codex, Pi, Claude Code, and OpenCode each remain in a real terminal pane with their own process, prompt, logs, and working directory. Herdr detects their state, rolls it up across projects, and gives both me and the agents a programmable way to coordinate the work.

The value is not terminal customization. The value is leverage:

- I can see which agents are working, blocked, done, or idle without polling every terminal.
- Closing the terminal client does not stop active agents. The background server keeps their processes alive.
- Official integrations retain native conversation identities so supported agents can resume after a full server restart.
- The CLI and local socket API let agents inspect panes, read output, wait for work, run commands, and start helper agents.
- Remote attach lets the same workflow continue on another machine or from an SSH client.

Herdr is most useful once one agent becomes several. For a single short task, a normal terminal is usually simpler.

Sources: [Agents](https://herdr.dev/docs/agents/), [agent automation](https://herdr.dev/docs/agent-automation/), [socket API](https://herdr.dev/docs/socket-api/).

## Install

I install Herdr with Homebrew:

```bash
brew install herdr
herdr --version
```

Official alternatives are available when Homebrew is not the right fit:

```bash
# Direct stable installer on Linux or macOS
curl -fsSL https://herdr.dev/install.sh | sh

# mise
mise use -g herdr

# Nix, pinned to the current stable release
nix profile install github:herdrdev/herdr/v0.8.0
```

Manual binaries are also published for Linux and macOS on x86_64 and aarch64. Stable releases support Linux and macOS. Native Windows support is currently a preview-only beta.

If you use the shell installer in a sensitive environment, inspect [install.sh](https://herdr.dev/install.sh) before executing it.

Verify the install:

```bash
command -v herdr
herdr --version
herdr
```

Source: [Install Herdr](https://herdr.dev/docs/install/).

## My configuration

Herdr reads `~/.config/herdr/config.toml` on Linux and macOS. I deliberately override only three values:

```toml
[theme]
name = "rose-pine"

[keys]
prefix = "`"

[experimental]
pane_history = false
```

Everything else follows Herdr's defaults.

The Rose Pine theme is a visual preference. The backtick prefix gives the control layer a compact, easy-to-reach key. Press the prefix, release it, then press the action key. For example, prefix then `q` detaches and prefix then `?` opens active keybinding help. Press the prefix twice to send a literal backtick to the pane.

`pane_history = false` is a security choice. Herdr does not save recent pane screen contents to `session-history.json` across a full server restart. Terminal output can contain prompts, command output, tokens, and other sensitive data. This setting does not disable live persistence while the server is running, layout restore, or native agent conversation restore.

Validate and reload the configuration:

```bash
herdr config check
herdr server reload-config
```

The portable file lives at [`dotfiles/config/herdr/config.toml`](../dotfiles/config/herdr/config.toml). The repository linker installs it without copying credentials or runtime state.

Sources: [Configuration](https://herdr.dev/docs/configuration/), [config reference](https://herdr.dev/docs/config-reference/), [session state and restore](https://herdr.dev/docs/session-state/).

## Connect the AI harnesses

Herdr detects supported agents without integrations, but the official integrations add better lifecycle reporting, native session identity, or both.

Install the integrations you use:

```bash
herdr integration install pi
herdr integration install claude
herdr integration install codex
herdr integration install opencode

herdr integration status
```

| Agent | What the integration adds | Files it manages |
| --- | --- | --- |
| Pi | Authoritative lifecycle state and native session identity | `~/.pi/agent/extensions/herdr-agent-state.ts`, or the configured Pi agent directory |
| Claude Code | Native session identity; visible state still comes from screen detection | A Herdr hook plus entries in Claude's `settings.json` |
| Codex | Native session identity; visible state still comes from screen detection | `herdr-agent-state.sh`, `hooks.json`, and enabling `[features] hooks = true` |
| OpenCode | Authoritative lifecycle state and native session identity | `~/.config/opencode/plugins/herdr-agent-state.js` |

The relevant agent configuration directory must already exist before installation. Re-running `herdr integration install <agent>` upgrades an outdated bundled integration.

Verify the integration:

```bash
herdr integration status --outdated-only
herdr agent list
```

Start each agent inside a Herdr pane, then confirm it appears in `herdr agent list`. If a status looks wrong:

```bash
herdr agent explain <agent-name-or-pane-id>
herdr pane read <pane-id> --source detection
```

Pi and OpenCode can report lifecycle state directly. Claude Code and Codex deliberately use screen-manifest detection for working, idle, and blocked because their hooks do not author every lifecycle transition.

Source: [Integrations](https://herdr.dev/docs/integrations/), [Agents](https://herdr.dev/docs/agents/).

## Give agents the Herdr skill

Herdr ships a release-matched skill that teaches an AI agent how to operate Herdr from inside its own pane:

```bash
npx skills add herdrdev/herdr --skill herdr -g
```

The installed binary can also print its bundled copy:

```bash
herdr --skill
```

The skill teaches an agent to:

- Inspect workspaces, tabs, panes, and neighboring agents.
- Split a pane and run a command without stealing focus.
- Read another pane's visible or recent output.
- Wait for a test, server, or agent state change.
- Start a helper agent in a sibling pane.
- Coordinate through stable pane and agent identifiers.

Herdr injects `HERDR_ENV=1` into managed panes. The skill's first guardrail is to stop if that variable is absent, preventing an agent outside Herdr from trying to control a session it does not own.

This is the important distinction in my workflow: Herdr does not merely display agents. It gives them a bounded control surface for coordinating their own environment.

Sources: [Agent skill file](https://herdr.dev/docs/agent-skill/), [agent-facing setup guide](https://herdr.dev/agent-guide.md).

## Persistence and remote work

Detach from the client with the configured prefix followed by `q`. The server, panes, and agent processes continue running. Reattach with:

```bash
herdr
```

This live detach and reattach path is the strongest persistence mode because the original processes never stop.

A full server stop is different. It terminates pane processes, then later restores the workspace, tab, pane layout, working directories, and focus. With current official integrations, supported AI conversations can resume through their native session references. Because I keep pane history disabled, arbitrary terminal screen contents are not replayed from disk.

For remote work, choose one of two paths. Run Herdr entirely on the remote machine:

```bash
ssh workbox
herdr
```

Or keep the Herdr client local and attach to a remote server:

```bash
herdr --remote workbox
```

The local client keeps local keybindings and can bridge local image clipboard paste to the remote session. Herdr uses normal OpenSSH authentication. Verify ordinary SSH first if remote attach fails.

Sources: [How to work with Herdr](https://herdr.dev/docs/how-to-work/), [persistence and remote access](https://herdr.dev/docs/persistence-remote/).

## Update safely

For a Homebrew installation:

```bash
brew update
brew upgrade herdr
herdr --version
herdr status
herdr integration status --outdated-only
```

Homebrew, mise, and Nix installations must be updated through their package manager. `herdr update` is reserved for installations managed by Herdr's direct installer. The experimental direct-install handoff path attempts to preserve live pane processes:

```bash
herdr update --handoff
```

After an update, compare the installed client and running server with `herdr status`. A compatible old server may remain alive after the binary changes. If a restart is required, finish or checkpoint every active agent before running:

```bash
herdr server stop
herdr
herdr status
```

`herdr server stop` terminates every process in the default session. Named sessions must be inspected and stopped separately.

## Roll back

Herdr does not expose a version argument for `herdr update`. A rollback depends on the installation method.

Before rolling back:

```bash
herdr --version
herdr status
herdr integration status
herdr session list
```

Then:

1. Finish or checkpoint active work and stop the affected server with the current client.
2. Install a tagged older release through Nix or download the matching versioned binary from the official release manifest.
3. Verify the target binary with `herdr --version` before launching it.
4. Reinstall the integrations from that binary so their hook versions match.
5. Start Herdr and verify `herdr status` and `herdr integration status`.

Preserve `~/.config/herdr/config.toml` before a downgrade because an older binary may not understand newer configuration keys.

## Uninstall

Remove integrations first so agent configuration files do not retain Herdr-managed hooks:

```bash
herdr integration uninstall pi
herdr integration uninstall claude
herdr integration uninstall codex
herdr integration uninstall opencode

herdr integration status
```

Then finish active work and stop the relevant sessions. Stopping a server terminates its pane processes.

```bash
herdr server stop
brew uninstall herdr
command -v herdr
```

Uninstalling the binary does not require deleting `~/.config/herdr`. Keep that directory if rollback or recovery is possible. It contains configuration, session layout, sockets, and rotating logs. Review and archive it recoverably before deciding on permanent deletion.

## Security boundaries

- Herdr advertises no account requirement and no telemetry.
- Keep pane history disabled when terminal output may contain credentials, private prompts, or sensitive command output.
- Treat `~/.config/herdr` like terminal history even with pane history disabled. Session metadata and logs still live there.
- The local socket can read panes, send input, launch commands, and control sessions. Only trusted processes and agents under the same user account should receive access to it.
- Official integrations modify each agent's local hook or plugin configuration. Use Herdr's uninstall commands instead of deleting individual files by hand.
- Remote attach uses ordinary OpenSSH authentication. Do not put credentials in the Herdr config.
- Agent state is an attention signal, not an authorization decision. Never use displayed state alone as permission to send input or perform a destructive action.
- `herdr server stop` is destructive to live pane processes even though the saved layout can return later.

## When I would not use Herdr

I would skip Herdr when:

- One short-lived agent is enough.
- The task does not benefit from parallel agents, persistent processes, or remote attachment.
- The host is shared with users or processes that should not have access to the local control socket.
- Background servers or SSH persistence are prohibited by policy.
- I need arbitrary processes to survive a reboot or server crash. Detach preserves live processes, but snapshot restore does not.
- An unsupported agent requires exact lifecycle reporting. It will still run as a normal terminal process, but rich state may be absent.
- The work depends primarily on a graphical interface rather than terminal-based agents.

## Machine-specific health note

The Handbook stores intended portable configuration, not a snapshot of transient machine health. At the time this page was verified, my installed client was current but a running server and two integrations still needed a coordinated restart or upgrade. I intentionally did not encode that drift into the public default. Use `herdr status` and `herdr integration status --outdated-only` on each device, then checkpoint active work before stopping a server.
