import type { Metadata } from "next";
import Link from "next/link";
import { HomeHeader } from "./ui/Navigation";

export const metadata: Metadata = {
  title: {
    absolute: "Bandit's Handbook: Give AI a better way to work",
  },
  description:
    "Brayden's field-tested system for instructions, harnesses, tools, delegation, and verification that helps AI do real engineering work.",
};

const loop = [
  {
    number: "01",
    title: "Frame",
    body: "Make the outcome observable.",
  },
  {
    number: "02",
    title: "Equip",
    body: "Load the right context and tools.",
  },
  {
    number: "03",
    title: "Delegate",
    body: "Split independent work cleanly.",
  },
  {
    number: "04",
    title: "Verify",
    body: "Demand evidence before handoff.",
  },
];

const layers = [
  {
    number: "01",
    title: "Instructions",
    body: "Durable standards that travel with the work, stay concise, and tell the agent what good looks like here.",
    href: "/agents/instructions",
    label: "Shape the behavior",
  },
  {
    number: "02",
    title: "Harnesses",
    body: "The execution environments that hold context, permissions, tools, and the working loop from request to proof.",
    href: "/harnesses/codex",
    label: "Choose the operator",
  },
  {
    number: "03",
    title: "Agent tools",
    body: "A small set of high-leverage capabilities for coordination, version control, research, and reliable action.",
    href: "/tools/herdr",
    label: "Equip the system",
  },
  {
    number: "04",
    title: "Playbooks",
    body: "Repeatable paths through context, delegation, implementation, verification, and a reviewable handoff.",
    href: "/playbooks/context-to-completion",
    label: "Run the loop",
  },
];

const fieldNotes = [
  {
    meta: "Harness / Lead operator",
    title: "Use Codex for the long arc",
    body: "Repository context, bounded helpers, implementation, and validation in one sustained thread.",
    href: "/harnesses/codex",
  },
  {
    meta: "Tool / Control plane",
    title: "Know what every agent is doing",
    body: "Herdr turns a field of terminal agents into one navigable, persistent workspace.",
    href: "/tools/herdr",
  },
  {
    meta: "Tool / Git flow",
    title: "Keep the save cheap and the history clean",
    body: "Kite separates fast local checkpoints from AI-assisted, reviewable commits.",
    href: "/tools/kite",
  },
];

export default function Home() {
  return (
    <div className="home-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <HomeHeader />

      <main id="main-content">
        <section className="home-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span>Field manual / 001</span>
              <span>Public source</span>
            </div>
            <h1>
              Give AI a better
              <br />
              way to <em>work.</em>
            </h1>
            <p>
              The operating system behind how Brayden frames work, equips
              agents, runs multiple harnesses, and turns fast execution into
              something engineers can trust.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/start">
                Start with the system <span aria-hidden="true">→</span>
              </Link>
              <Link
                className="button button-secondary"
                href="/playbooks/context-to-completion"
              >
                Open the playbooks
              </Link>
            </div>
            <div className="hero-proof">
              <span>Instructions</span>
              <i aria-hidden="true" />
              <span>Harnesses</span>
              <i aria-hidden="true" />
              <span>Tools</span>
              <i aria-hidden="true" />
              <span>Proof</span>
            </div>
          </div>

          <div className="hero-loop" aria-label="The AI working loop">
            <div className="loop-heading">
              <span>The working loop</span>
              <span>BH / SYS</span>
            </div>
            <ol>
              {loop.map((item) => (
                <li key={item.number}>
                  <span>{item.number}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
            <Link href="/system">
              Read the operating model <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        <section className="signal-strip" aria-label="Handbook principle">
          <span aria-hidden="true">✦</span>
          <p>
            Speed is a systems property. Better context, sharper tools, clean
            delegation, and proof on every pass.
          </p>
          <span aria-hidden="true">✦</span>
        </section>

        <section className="home-section system-section">
          <header className="section-heading">
            <div>
              <span className="section-kicker">The system / Four layers</span>
              <h2>Everything the agent needs. Nothing it does not.</h2>
            </div>
            <p>
              This is not a tour of an entire development machine. It is the
              portable layer that makes AI more capable, more aligned, and
              easier to verify.
            </p>
          </header>

          <div className="layer-grid">
            {layers.map((layer) => (
              <Link href={layer.href} className="layer-card" key={layer.title}>
                <div className="layer-card-top">
                  <span>{layer.number}</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <h3>{layer.title}</h3>
                <p>{layer.body}</p>
                <span className="layer-label">{layer.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section field-section">
          <header className="section-heading compact-heading">
            <div>
              <span className="section-kicker">From the field</span>
              <h2>The working kit.</h2>
            </div>
            <Link href="/reference/repository">
              Browse the full map <span aria-hidden="true">→</span>
            </Link>
          </header>

          <div className="field-grid">
            {fieldNotes.map((note, index) => (
              <Link href={note.href} className="field-card" key={note.title}>
                <span className="field-card-index">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="field-card-meta">{note.meta}</span>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <span className="field-card-link">
                  Open field note <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="portable-section">
          <div className="portable-code" aria-hidden="true">
            <span>$ handbook sync</span>
            <strong>public core</strong>
            <span>→ instructions linked</span>
            <span>→ harness config linked</span>
            <span>→ private state untouched</span>
            <i>ready_</i>
          </div>
          <div className="portable-copy">
            <span className="section-kicker">Portable by design</span>
            <h2>One source of truth, without publishing your private life.</h2>
            <p>
              Safe defaults and agent-facing configuration travel across
              devices. Credentials, authentication, histories, work endpoints,
              and machine trust stay outside the public boundary.
            </p>
            <Link className="text-link" href="/setup/portable">
              See the sync model <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="home-cta">
          <span className="section-kicker">Start now</span>
          <h2>
            Make the next AI task
            <br />
            the first one that compounds.
          </h2>
          <div>
            <Link className="button button-primary" href="/start">
              Open the quick start <span aria-hidden="true">→</span>
            </Link>
            <a
              className="button button-secondary"
              href="https://github.com/binbandit/handbook"
              target="_blank"
              rel="noreferrer"
            >
              Copy the source <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div>
          <strong>Bandit&apos;s Handbook</strong>
          <span>An open field manual for AI-enabled engineering.</span>
        </div>
        <div>
          <Link href="/start">Start</Link>
          <Link href="/system">System</Link>
          <Link href="/tools/herdr">Tools</Link>
          <a
            href="https://github.com/binbandit/handbook"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
