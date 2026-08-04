import Link from "next/link";
import type { HandbookPage } from "../content";
import { getAdjacentPages } from "../content";
import {
  markdownBySourcePath,
  markdownHeadings,
} from "../markdown";
import { DocsShell } from "./DocsShell";
import { MarkdownGuide } from "./MarkdownGuide";

const githubBase = "https://github.com/binbandit/handbook/blob/main/";

export function Guide({ page }: { page: HandbookPage }) {
  const adjacent = getAdjacentPages(page.slug);
  const markdown = markdownBySourcePath[page.sourcePath];
  const headings = markdownHeadings(markdown);
  const sectionCount = headings.length.toString().padStart(2, "0");

  return (
    <DocsShell activeSlug={page.slug}>
      <a className="skip-link" href="#guide-content">
        Skip to guide
      </a>
      <main id="main-content" className="guide-main">
        <article className="guide-article">
          <header className="guide-hero">
            <div className="guide-breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Handbook</Link>
              <span aria-hidden="true">/</span>
              <span>{page.eyebrow.split(" / ")[0]}</span>
            </div>

            <div className="guide-meta-row">
              <span>{page.eyebrow}</span>
              <span>
                {sectionCount} sections / {page.readingTime}
              </span>
            </div>

            <h1>{page.title}</h1>
            <p className="guide-deck">{page.description}</p>

            <div className="guide-source-row">
              <span className="status-dot">
                <i aria-hidden="true" /> Canonical guide rendered below
              </span>
              <a
                href={`${githubBase}${page.sourcePath}`}
                target="_blank"
                rel="noreferrer"
              >
                {page.sourcePath} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </header>

          <div className="guide-grid">
            <div className="guide-content" id="guide-content">
              <MarkdownGuide markdown={markdown} sourcePath={page.sourcePath} />
            </div>

            <aside className="guide-toc" aria-label="On this page">
              <p>On this page</p>
              <ol>
                {headings.map((heading, index) => (
                  <li key={`${heading.id}-${index}`}>
                    <a href={`#${heading.id}`}>
                      <span>{(index + 1).toString().padStart(2, "0")}</span>
                      {heading.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          </div>

          <nav className="guide-pagination" aria-label="Guide pagination">
            {adjacent.previous ? (
              <Link href={adjacent.previous.slug} rel="prev">
                <span>Previous</span>
                <strong>← {adjacent.previous.navTitle}</strong>
              </Link>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <Link href={adjacent.next.slug} rel="next">
                <span>Next</span>
                <strong>{adjacent.next.navTitle} →</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>

          <footer className="guide-footer">
            <span>Bandit&apos;s Handbook</span>
            <span>Built for people who give AI real work.</span>
          </footer>
        </article>
      </main>
    </DocsShell>
  );
}
