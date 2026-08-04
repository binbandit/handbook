import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { handbookPages } from "../content";
import { headingId, markdownBody } from "../markdown";
import { CodeBlock } from "./CodeBlock";

const githubBlob = "https://github.com/binbandit/handbook/blob/main/";
const sourceRoute = new Map(
  handbookPages.map((page) => [page.sourcePath, page.slug]),
);

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }
  if (children && typeof children === "object" && "props" in children) {
    return textFromChildren(
      (children as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

function normalizePath(sourcePath: string, href: string) {
  const [rawPath, hash] = href.split("#", 2);
  const sourceDirectory = sourcePath.split("/").slice(0, -1);
  const segments = rawPath.startsWith("/")
    ? rawPath.slice(1).split("/")
    : [...sourceDirectory, ...rawPath.split("/")];
  const normalized: string[] = [];

  for (const segment of segments) {
    if (!segment || segment === ".") continue;
    if (segment === "..") normalized.pop();
    else normalized.push(segment);
  }

  return {
    path: normalized.join("/"),
    hash: hash ? `#${hash}` : "",
  };
}

function markdownHref(sourcePath: string, href?: string) {
  if (!href) return "#";
  if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith("#")) {
    return href;
  }

  const resolved = normalizePath(sourcePath, href);
  const handbookRoute = sourceRoute.get(resolved.path);
  if (handbookRoute) return `${handbookRoute}${resolved.hash}`;

  return `${githubBlob}${resolved.path}${resolved.hash}`;
}

export function MarkdownGuide({
  markdown,
  sourcePath,
}: {
  markdown: string;
  sourcePath: string;
}) {
  const components: Components = {
    h2: ({ children }) => {
      const id = headingId(textFromChildren(children));
      return (
        <h2 id={id}>
          <a href={`#${id}`}>{children}</a>
        </h2>
      );
    },
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    a: ({ href, children }) => {
      const resolved = markdownHref(sourcePath, href);
      const external = /^(https?:|mailto:|tel:)/.test(resolved);

      return (
        <a
          href={resolved}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {children}
          {external ? <span aria-hidden="true"> ↗</span> : null}
        </a>
      );
    },
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children }) => {
      const rawValue = String(children);
      const value = rawValue.replace(/\n$/, "");
      const language = className?.replace("language-", "") || "Code";
      const block = Boolean(className) || rawValue.includes("\n");

      return block ? (
        <CodeBlock label={language} value={value} />
      ) : (
        <code className="inline-code">{children}</code>
      );
    },
    table: ({ children }) => (
      <div className="markdown-table-wrap">
        <table>{children}</table>
      </div>
    ),
  };

  return (
    <div className="canonical-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdownBody(markdown)}
      </ReactMarkdown>
    </div>
  );
}
