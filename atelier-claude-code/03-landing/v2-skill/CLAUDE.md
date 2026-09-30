# CLAUDE.md

## Project
Single-file landing page for ATA suarl, a creative technology studio in Dakar
(3D animation, XR, video games, generative AI).
Preview: open `index.html` directly in a browser. No build, no server.

## Files
- `index.html` — markup, CSS tokens in `:root`, quiz + form JS at the bottom
- `../v1-no-skill/index.html` — baseline without the design skill; do not edit
- Plugin `frontend-design` is enabled at local scope (repo `.claude/settings.local.json`)

## Art direction (keep it)
- Theme: Dakar's hand-painted "car rapide" buses
- Signature: the 3-stripe `.band` (yellow / red / ocean); it is the only animated element
- Headlines: `--display` condensed stack, uppercase, sign-painter shadow
  (`--signal-red` then `--ink` offsets). Body: `--body` humanist stack
- Palette tokens only: `--route-blue`, `--ocean`, `--car-yellow`, `--signal-red`,
  `--chalk`, `--ink`, `--ink-soft`. No raw hex outside `:root`
- Radii: 999px for pills and buttons, 14–18px for panels. Hard offset shadows, never blurred
- Line length ≤ `--measure` (62ch)

## Quiz
- `STEPS` (sector → format → budget) and `OFFERS` keyed by format label, `TIERS` by budget index
- Renaming a format option means renaming its `OFFERS` key too
- The route list `#stops` mirrors `step`; keep `data-i` in sync with `STEPS`

## Content rules
- French copy, plain sentence case in body text
- No invented clients, testimonials, ratings, awards or figures
- Portfolio stays as `[Projet à venir n]` until real projects are supplied
- The contact form validates client-side only and sends nothing; say so in the UI

## Do
- Respect `prefers-reduced-motion` for any new motion
- Check at 360px wide: no horizontal scroll
- Keep visible focus (`:focus-visible` red outline)

## Don't
- Add frameworks, build tools, external fonts or CDNs
- Add a second animated element or per-section fade-ins
- Use all-caps small labels or eyebrow text above headings
