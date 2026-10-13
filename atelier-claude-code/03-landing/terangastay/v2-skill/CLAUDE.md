# CLAUDE.md

## Project
Single-file landing page for TerangaStay: direct booking requests for small independent
Senegalese guesthouses. Content and behaviour come from `../brief.md` — follow it verbatim.
Preview: open `index.html` directly in a browser. No build, no server.

## Files
- `index.html` — markup, CSS tokens in `:root`, quiz + form JS at the bottom
- `../v1-no-skill/index.html` — baseline generated without any skill; do not edit
- `../brief.md` — the shared content brief, identical for both versions; do not edit
- Plugin `frontend-design` is enabled at local scope (repo `.claude/settings.local.json`)
- Invoke `/terangastay-brand` at the start of the session

## Art direction (harvested — keep it)
- This is the real product's design system, not a new concept: warm, editorial, coastal.
  Source of truth: `elegant-builds-studio/src/styles.css`. Do not invent a palette.
- Colours only as tokens in `:root`, oklch verbatim, each preceded by its derived sRGB value
  (old-browser fallback, see the brand skill's sRGB exception). No colour outside `:root`.
  Sable `oklch(0.978 0.011 85)` · Sable chaud `oklch(0.948 0.02 80)` · Carte `oklch(1 0 0)` ·
  Encre `oklch(0.24 0.03 225)` · Encre atténuée `oklch(0.48 0.025 225)` ·
  Terre cuite `oklch(0.6 0.13 42)` · Terre cuite foncée `oklch(0.53 0.13 40)` ·
  Teal `oklch(0.43 0.075 205)` · Sable bordure `oklch(0.88 0.02 80)`
- Contrast, measured: Terre cuite reaches only 4.18:1 on white and fails AA for normal text.
  Small text, links and filled buttons use Terre cuite foncée (5.58:1). Teal takes Blanc chaud
  `oklch(0.99 0.003 96)` text (7.63:1).
- The honesty line of the quiz result uses the "Données de démonstration" pair:
  `oklch(0.37 0.07 62)` on `oklch(0.95 0.04 80)`. No green anywhere, no "confirmed" colour.
- Display: `ui-serif, Georgia, serif`, weight 500, tight tracking, sentence case. The product
  loads Fraunces; this page must open offline, so it uses the fallback stack — assumed deviation.
- Body: `ui-sans-serif, system-ui, sans-serif`. Line length ≤ `--measure` (62ch).
- Eyebrows are allowed — Fraunces-style italic serif in Terre cuite foncée, as in the product.
  (Pass 1 banned them for ATA; that rule does not carry over.)
- Radii: 6px for panels and inputs (the product's `--radius`), 999px for pills.
  Soft, wide shadows only (`0 18px 50px` at ~7% Encre). Never hard offset shadows.

## Quiz
- `STEPS` (zone → type → budget), `OFFERS` keyed by type label (capacity), `TIERS` by budget
  index (price bounds). Renaming a type option means renaming its `OFFERS` key too.
- The progress list mirrors `step`; keep its indices in sync with `STEPS`.
- The result is a lead, never an offer and never an availability.

## Content rules
- Every string marked "mot pour mot" in the brief is copied exactly.
- Never write « disponible », « confirmée », « réservée » or « garanti » about a room or a request.
- Prices copied from the brief's table with their catalogue date. No sum, no product, no total.
- No invented phone, email, payment link, review, rating, testimonial or figure.
- The form sends nothing, asks for neither email nor phone, and says so in the UI.

## Do
- Respect `prefers-reduced-motion` for any motion
- Check at 360px wide: no horizontal scroll
- Keep a visible focus ring in Teal on every interactive element

## Don't
- Add frameworks, build tools, external fonts, images or CDNs
- Add more than one animated element
- Use any colour that is not a token in `:root`
