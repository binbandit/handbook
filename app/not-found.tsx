import Link from "next/link";
import { Brand } from "./ui/Brand";

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <Brand />
      <span className="section-kicker">Field note missing / 404</span>
      <h1>That trail goes cold.</h1>
      <p>
        The page may have moved, or it may not be part of the public handbook.
      </p>
      <Link className="button button-primary" href="/">
        Return to the handbook <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
