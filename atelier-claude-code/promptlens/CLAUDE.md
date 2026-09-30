# PromptLens — CLAUDE.md

## What this is
A web app to log visual references for AI video productions.
An entry describes one shot for a named production. Three ways to add one:
1. pick one of 20 built-in shot presets,
2. describe a shot in text (AI fills the fields),
3. upload a frame (AI reads the image).
Phase 1 = presets + journal, localStorage. Phase 2 = Gemini via Firebase Cloud Functions.

## Stack & versions
- Node 20.19+ (Vite 7 requirement), npm
- Vite + React + TypeScript (`strict: true`, no `any` without a comment)
- Firebase: Hosting, Cloud Functions 2nd gen (Node 20, TypeScript), Firestore later
- Gemini through the official Google Gen AI SDK (`@google/genai`), server-side only
- No UI library, no router, no state library

## Commands
- dev: `npm run dev` (http://localhost:5173)
- build: `npm run build` (type-check + Vite build; must pass before any commit)
- preview build: `npm run preview`
- functions build: `npm --prefix functions run build`
- emulators: `firebase emulators:start --only functions` (no Java needed)
- deploy (manual, ask first): `firebase deploy --only hosting,functions`
- secrets (prod): `firebase functions:secrets:set GEMINI_API_KEY`

## Folder structure (target)
```
src/
  main.tsx, App.tsx, styles.css
  types.ts                 # Preset, Entry, ShotDescription
  data/presets.ts          # the 20 built-in presets
  lib/repository.ts        # storage interface + localStorage impl (swap for Firestore)
  lib/firebase.ts          # Firebase app + callable functions (phase 2)
  features/presets/        # preset library
  features/journal/        # journal per production
  features/describe/       # text -> shot (phase 2)
  features/image/          # image -> shot (phase 2)
functions/
  src/index.ts             # callable exports
  src/describeShot.ts      # Gemini calls + zod schemas
docs/decisions.md          # dated decision log
```

## Conventions
- Code, identifiers, comments, commits: English. UI copy: French.
- Components: PascalCase files, one component per file. Hooks: `useX`.
- All persistence goes through `src/lib/repository.ts`; components never touch localStorage.
- Domain types live in `src/types.ts`; the functions keep their own zod schema that mirrors them.
- CSS: plain CSS with custom properties in `:root`; no inline colour values.
- IDs: `crypto.randomUUID()`. Dates: ISO strings.

## Domain terms
- **Shot size**: extreme wide, wide, full, medium, medium close-up, close-up, extreme close-up
- **Camera angle**: eye level, high angle, low angle, bird's-eye, dutch, over-the-shoulder
- **Focal length**: in mm (e.g. 24, 35, 50, 85)
- **Lighting setup**: e.g. golden hour, high-key, low-key, chiaroscuro, neon, overcast
- **Palette**: list of hex colours
- **Generation prompt**: English prompt for the video model, derived from the other fields
- **Production**: a named project that groups entries (e.g. a clip, a documentary)

## Workflow
plan (plan mode) -> implement -> `npm run build` -> update `docs/decisions.md`
(dated entry: what, why, trade-offs) -> update this file only if a convention changed.

## Never
- Commit `.env*` (except `.env.example`) or `functions/.secret.local`
- Put an API key in the client or in any `VITE_*` variable (it ships in the bundle)
- Call Gemini from the browser
- Change Firebase rules (`firestore.rules`, `storage.rules`) without asking
- Deploy without asking
