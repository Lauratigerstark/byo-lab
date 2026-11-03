# byolab

<context>

A design lab you build with an agent. It holds:

- **Specimens** (`src/specimens/<slug>`): kept components, one idea each, shown in the gallery at `/` with a workbench at `#/s/<slug>`.
- **Drafts** (`src/drafts/<slug>`): new work waiting for a keep or toss. They show under "To judge" in the gallery.
- **Films** (`film.ts` next to a specimen, or `src/films/<slug>/storyboard.ts`): code-defined videos that drive the real component, rendered frame by frame to mp4.
- **Taste** (`TASTE.md`, `GRID.md`): the owner's rules. Every toss reason and crit note becomes one.
- **Design system** (`#/system`): the current tokens and rules, read live from `src/index.css`, `TASTE.md`, and `GRID.md`. It has no source of its own, so there is nothing to update by hand.
- **Design evolution** (`#/designevolution`): the history in `LEDGER.md`, with every design change, keep, and toss.

</context>

<instructions>

- MUST read `TASTE.md` and `GRID.md` before building or reviewing anything. They are the owner's taste and override any default you have.
- Create work with `pnpm lab new <slug>`. MUST NOT hand-create a draft folder: the command writes the registry entry, component, and film in the shape the lab and renderer expect.
- New work starts as a draft. Only the owner keeps or tosses it, in the gallery or by asking you to run `pnpm lab keep` / `pnpm lab toss`. MUST NOT judge for them.
- When the owner gives a crit note, fix it, then add one line to `TASTE.md` as a rule with its reason. A note that stays in the conversation is lost.
- When a change touches `src/index.css`, `TASTE.md`, or `GRID.md`, run `pnpm lab log <tokens|taste|grid> --what ".." --reason ".."` and stage `LEDGER.md` with it. The pre-commit hook blocks the commit otherwise, because a decision without its why can't be reviewed later. Other commits need no line.
- Use `--json` when you need to read a command's result.
- `pnpm lab grid <slug>` MUST pass before handing work over.
- Films MUST stay deterministic: state comes from `useFilmFrame()` and the timeline, never `Math.random`, timers, or wall-clock time. `pnpm lab check <film>` MUST pass before a render is called done.
- UI uses the shadcn components in `src/components/ui` and the tokens in `src/index.css`. Change the theme there, not per component. Icons come from `lucide-react`.
- Radii and text sizes MUST use tokens, because a literal won't follow a theme change: `rounded-surface`, `rounded-control`, `rounded-chip`, and `text-title`, `text-body`, `text-meta`. Use a literal only for a value with no token, like a derived nested radius.
- Read a still after rendering it. "It rendered" is not "it looks right".
- DialKit (`dialkit`) is installed for live tuning. Use `useDialKit` while values are being tuned, and bake the final numbers into plain constants before a film is called done, because films must be deterministic.
- The lab's version is `version` in `package.json`; releases and what to do about them are in `CHANGELOG.md`.
- Ask before adding a dependency.

| Task | Load |
| --- | --- |
| Owner asks what to do, how it works, or is new | `.agents/skills/lab-start/SKILL.md` |
| Update or upgrade the lab, or "what changed" | `.agents/skills/lab-update/SKILL.md` |
| Build or refine a component | `.agents/skills/lab-component/SKILL.md` |
| Without-versus-with explainer | `.agents/skills/lab-explainer/SKILL.md` |
| Make, retime, or render a film | `.agents/skills/lab-film/SKILL.md` |
| Propose new ideas | `.agents/skills/lab-ideas/SKILL.md` |

</instructions>

<commands>

```bash
pnpm dev                                  # lab at :5420, films at /film.html?film=<film>
pnpm lab help                             # every command
pnpm lab new <slug> [--kind component|explainer|breakdown] [--name ".."] [--idea ".."] [--size 480x320]
pnpm lab list [--json]
pnpm lab keep <slug>
pnpm lab toss <slug> --reason "one line"
pnpm lab log <tokens|taste|grid> --what ".." --reason ".."
pnpm lab grid <slug>
pnpm lab check <film> [--theme light|dark]
pnpm lab still <film> <seconds> [--theme light|dark]
pnpm lab render <film> [--theme light|dark] [--height 2160] [--no-sound] [--sheet 2]
pnpm lab export <film> [--theme light|dark|both] [--height 2160] [--no-sound]
pnpm typecheck && pnpm lint && pnpm build
```

</commands>
