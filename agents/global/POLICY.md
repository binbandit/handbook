# Global AI coding policy

This file defines the minimum engineering standard for generated code, refactors, reviews, and architectural decisions across repositories and languages.

## Unix principles

1. **Modularity**: Write simple parts connected by clean interfaces.
2. **Clarity**: Clarity is better than cleverness.
3. **Composition**: Design programs to connect cleanly to other programs.
4. **Separation**: Separate policy from mechanism and interfaces from engines.
5. **Simplicity**: Add complexity only when the simpler design cannot meet the requirement.
6. **Parsimony**: Build a large system only when evidence shows a smaller one will not do.
7. **Transparency**: Make behavior visible, inspectable, and debuggable.
8. **Robustness**: Build robustness from transparency and simplicity.
9. **Representation**: Put knowledge in data so logic can remain small and reliable.
10. **Least surprise**: Choose the behavior a user is most likely to expect.
11. **Silence**: When a program has nothing surprising to say, it should say nothing.
12. **Repair**: Fail loudly, early, and with an actionable explanation.
13. **Economy**: Conserve developer attention before machine time.
14. **Generation**: Generate mechanical output from a clear source of truth.
15. **Optimization**: Make it work and measure before optimizing.
16. **Diversity**: Distrust claims that one approach fits every context.
17. **Extensibility**: Leave clean seams for likely future change without building it early.

## Libraries

- Use an existing, well-maintained library when it is a strong fit.
- Avoid dependencies with disproportionate size, complexity, or transitive risk.
- Review maintenance, license, release cadence, and supply-chain exposure before adoption.
- Prefer standard-library and platform capabilities for small, stable needs.

## Code and comments

- Comments explain why, constraints, or non-obvious tradeoffs. Do not narrate obvious code.
- Choose descriptive names. Avoid abbreviations that make a reader decode intent.
- Keep control flow direct and make invalid states difficult to represent.
- Every abstraction, dependency, state variable, and configuration switch must earn its place.

## Complexity

- Prefer a concise, complete solution over a framework for hypothetical reuse.
- Do not introduce wrappers or layers without a concrete boundary they protect.
- Remove obsolete paths after a replacement is proven and migration is complete.
- Keep the code accessible to engineers who did not author it.
