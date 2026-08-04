# 0003: Build the site from canonical Markdown

- Status: accepted
- Date: 2026-08-05

## Decision

The public Handbook uses Next.js 16, React 19, TypeScript, Tailwind CSS 4, and vinext on the Sites Cloudflare runtime. Guide routes bundle the checked-in Markdown sources directly and render them with GitHub-flavored Markdown.

The website owns navigation, search, typography, responsive layout, copy controls, metadata, and presentation. It does not own a second long-form copy of any guide.

## Why

The repository must remain useful in three forms:

1. A website an engineer can browse and share.
2. Markdown that GitHub can render and review.
3. Files an agent can read without scraping the website.

Bundling the canonical Markdown satisfies all three. A separate docs content database or manually duplicated page model would drift from the installable artifacts and make review harder.

The runtime is deliberately small:

- No database or authenticated application state.
- No remote font, icon, analytics, or UI dependency.
- Client JavaScript only for search, responsive navigation, and copying code.
- Request-derived absolute metadata URLs so previews work on local, preview, and production hosts.

## Version policy

Stable patch and minor updates were applied where the production build and complete test gate remained green. The initial release uses Next 16.3.0, React 19.2.8, Tailwind CSS 4.3.3, Vite 8.2.0, Wrangler 4.118.0, and the Cloudflare Vite plugin 1.50.0.

vinext remains on the tested 0.0.50 line. TypeScript remains on 5.9 and ESLint on 9. The newer vinext release is a beta and the newer TypeScript and ESLint lines are major upgrades. "Latest" is not treated as more important than a coherent, tested deployment graph.

## Security review

On the decision date:

- `npm audit --omit=dev --audit-level=high` reported zero production vulnerabilities.
- The full development audit reported transitive `undici` advisories through Miniflare, Wrangler, and the Cloudflare Vite plugin.
- npm offered no non-breaking resolution. Its forced proposal would downgrade Wrangler to 4.35.0 and disrupt the tested toolchain.

The development-only advisories are accepted temporarily and should be reassessed when Cloudflare publishes a compatible dependency graph. Do not run `npm audit fix --force` as an automatic remedy.

## Consequences

- Every new guide route needs an explicit source mapping, navigation entry, and render test.
- Markdown remains readable without the website, so presentation components cannot require custom authoring syntax.
- Dynamic request-host metadata means guide routes are rendered dynamically by the current runtime.
- Dependency updates require the complete lint, content, secret, production build, and route-rendering gate.
- The social image is a checked-in raster asset and must remain represented in metadata tests.
