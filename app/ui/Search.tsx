"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type SearchItem = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  tags: string[];
};

export function Search({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const labelId = useId();

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    setQuery("");
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      const triggerIsVisible = Boolean(
        triggerRef.current?.getClientRects().length,
      );

      if (
        triggerIsVisible &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setOpen(true);
      } else if (triggerIsVisible && event.key === "/" && !isTyping) {
        event.preventDefault();
        setOpen(true);
      } else if (open && event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items.slice(0, 7);

    return items
      .filter((item) =>
        [item.title, item.description, item.eyebrow, ...item.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      )
      .slice(0, 8);
  }, [items, query]);

  return (
    <>
      <button
        ref={triggerRef}
        className="search-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the handbook"
      >
        <span className="search-trigger-label">
          <span aria-hidden="true">⌕</span>
          Search handbook
        </span>
        <kbd>⌘ K</kbd>
      </button>

      {open ? (
        <div
          className="search-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <section
            ref={dialogRef}
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const focusable = Array.from(
                dialogRef.current?.querySelectorAll<HTMLElement>(
                  'a[href], button:not([disabled]), input:not([disabled])',
                ) ?? [],
              );
              const first = focusable[0];
              const last = focusable.at(-1);
              if (!first || !last) return;

              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            <h2 className="visually-hidden" id={labelId}>
              Search Bandit&apos;s Handbook
            </h2>
            <div className="search-input-wrap">
              <span aria-hidden="true">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools, harnesses, playbooks..."
                aria-label="Search query"
              />
              <button
                type="button"
                onClick={() => close()}
                aria-label="Close search"
              >
                Esc
              </button>
            </div>

            <div className="search-results" aria-live="polite">
              {results.length ? (
                results.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.slug}
                    onClick={() => close(false)}
                  >
                    <span className="search-result-kicker">{item.eyebrow}</span>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </Link>
                ))
              ) : (
                <div className="search-empty">
                  <span>No field note matches that search.</span>
                  <button type="button" onClick={() => setQuery("")}>
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
