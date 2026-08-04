import Link from "next/link";
import {
  handbookPageBySlug,
  handbookPages,
  navGroups,
} from "../content";
import { Brand } from "./Brand";
import { Search } from "./Search";

const searchItems = handbookPages.map((page) => ({
  slug: page.slug,
  title: page.title,
  description: page.description,
  eyebrow: page.eyebrow,
  tags: page.tags,
}));

export function HandbookNav({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className="handbook-nav" aria-label="Handbook navigation">
      {navGroups.map((group) => (
        <div className="nav-group" key={group.label}>
          <p>{group.label}</p>
          <ul>
            {group.slugs.map((slug) => {
              const page = handbookPageBySlug.get(slug);
              if (!page) return null;

              return (
                <li key={slug}>
                  <Link
                    href={slug}
                    aria-current={activeSlug === slug ? "page" : undefined}
                  >
                    <span>{page.navTitle}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DesktopSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <aside className="docs-sidebar">
      <div className="sidebar-top">
        <Brand />
        <Search items={searchItems} />
      </div>
      <HandbookNav activeSlug={activeSlug} />
      <div className="sidebar-footer">
        <span>Public field manual</span>
        <a
          href="https://github.com/binbandit/handbook"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  );
}

export function MobileHeader({ activeSlug }: { activeSlug?: string }) {
  return (
    <header className="mobile-header">
      <Brand compact />
      <div className="mobile-actions">
        <Search items={searchItems} />
        <details className="mobile-menu">
          <summary aria-label="Open handbook navigation">
            <span />
            <span />
          </summary>
          <div className="mobile-menu-panel">
            <HandbookNav activeSlug={activeSlug} />
            <a
              className="mobile-github"
              href="https://github.com/binbandit/handbook"
              target="_blank"
              rel="noreferrer"
            >
              Open on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}

export function HomeHeader() {
  return (
    <header className="home-header">
      <Brand />
      <nav aria-label="Primary navigation">
        <Link href="/system">System</Link>
        <Link href="/harnesses/codex">Harnesses</Link>
        <Link href="/playbooks/context-to-completion">Playbooks</Link>
      </nav>
      <div className="home-header-actions">
        <Search items={searchItems} />
        <a
          className="github-link"
          href="https://github.com/binbandit/handbook"
          target="_blank"
          rel="noreferrer"
        >
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
