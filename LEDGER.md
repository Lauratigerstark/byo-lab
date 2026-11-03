# Ledger

Every keep, toss, and design change, newest last. Agents read this before proposing ideas.

- 2026-11-03 changed `tokens`: Added radius and text-size tokens, and improved dark hovers. Why: A literal won't follow a theme change.
- 2026-11-03 kept `copy-button`: A copy button that shows the exact text it put on your clipboard, so you never wonder what you grabbed.
- 2026-11-03 changed `tokens`: Moved the selection, secondary button hover, and anatomy tints from oklch to oklab mixing. Why: OKLCH interpolates hue, which TASTE.md rules out for tints.
- 2026-11-03 changed `grid`: pnpm lab grid now reads the outer radius from --corner-surface instead of a hardcoded 24. Why: A radius change should move the check with it.
