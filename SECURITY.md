# Security policy

Bandit's Handbook is intended to be public. Treat every committed byte as permanently public, including deleted history.

## Never commit

- API keys, access tokens, passwords, session cookies, or private keys.
- `.env` files or rendered files containing environment values.
- Authentication databases or tool auth files.
- Work hostnames, internal service URLs, corporate identities, proxy details, or certificate paths.
- Terminal history, agent transcripts, prompts containing private code, logs, caches, or application state.
- Personal device identifiers that are not deliberately public.

Use the operating system credential store, a password manager, or a separate private repository for secret and employer-specific values. Public configuration may reference the name of an environment variable but must never contain its value.

## Before pushing

```bash
npm run check:secrets
git diff --cached
```

Enable GitHub secret scanning and push protection on the remote. These controls are defense in depth and do not replace review.

## Reporting a problem

Do not open a public issue containing a live secret. Revoke the credential first, then contact the repository owner privately with the affected path and commit. Assume a committed secret is compromised even if it was quickly removed.
