import Link from "next/link";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand${compact ? " brand-compact" : ""}`} href="/">
      <span className="brand-mark" aria-hidden="true">
        B
      </span>
      <span className="brand-type">
        <strong>Bandit&apos;s Handbook</strong>
        {!compact ? <small>AI operating system</small> : null}
      </span>
    </Link>
  );
}
