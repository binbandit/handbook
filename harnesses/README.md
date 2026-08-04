# Harnesses

A model answers. A harness lets the model inspect a repository, call tools, retain context, accept steering, delegate work, and prove a result. Choosing the harness changes the working loop as much as choosing the model.

I actively use two complementary harnesses:

| Harness | My default use | Strength | Tradeoff |
| --- | --- | --- | --- |
| [Codex](codex.md) | Primary delivery work from intent through verified change | Integrated instructions, tools, permissions, parallel tasks, review, and desktop workflow | More of the operating model is supplied by the product |
| [Pi](pi.md) | Terminal-first work where I want to shape the loop itself | Small core, model switching, extensions, skills, session trees, and embeddable modes | Extensions run with the launching user's authority, so isolation is my responsibility |

I choose Codex when I want the strongest complete delivery surface. I choose Pi when the harness should be assembled around the job or embedded into another workflow. Either can be effective when it receives clear instructions, useful tools, and an evidence-based finish line.

The rest of the Handbook is deliberately portable across both:

- [`agents/`](../agents/) defines durable behavior.
- [`skills/`](../skills/) packages procedures loaded only when relevant.
- [`tools/`](../tools/) extends what an agent can observe and do.
- [`playbooks/`](../playbooks/) defines complete working loops.

Do not copy a harness configuration as a substitute for understanding its authority. Start with the guide, use the smallest useful setup, and add capabilities only when a real workflow needs them.
