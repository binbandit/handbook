# 0002: Separate public AI workflows from private context

- Status: accepted
- Date: 2026-08-05

## Decision

The public repository contains portable AI workflows, configuration, and public opinion. Credentials, employer-specific configuration, private identities, actual host entries, and internal topology live in a separate private source or the operating system's credential store.

## Why

A public dotfile repository is both documentation and executable input. Accidentally publishing a token is an obvious failure, but internal hostnames, service URLs, proxy paths, corporate identities, and certificate locations can also disclose more than intended.

`.gitignore` is useful hygiene, not a security boundary. Git documents that ignored files can still be force-added and that ignore rules do not affect tracked content. GitHub secret scanning and push protection add defense in depth, but supported pattern detection cannot guarantee that every private value is caught.

Sources: [Git ignore rules](https://git-scm.com/docs/gitignore), [GitHub secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning), and [push protection](https://docs.github.com/en/code-security/concepts/secret-security/push-protection).

## Precedence

```text
public AI workflow
-> private work configuration
-> local credential lookup
-> unmanaged runtime state
```

Public examples use placeholder domains and generic role names. A work device links its private source separately. The public setup never attempts to discover, print, or merge that private layer.

## Consequences

- The previous dotfiles history will not be imported wholesale.
- Private work configuration remains available to Brayden without appearing in the Handbook.
- A reader can safely use the public base without access to any private repository.
- Secret response is simple: revoke first, then clean history, because deletion alone does not make an exposed credential safe.
