# Decisions

## 2026-09-30 — Initial build
- **What**: Phase 1 single-page app. Searchable library of 20 built-in shot presets
  (`src/data/presets.ts`), journal of entries grouped by named production, with a counter
  per production and duplicate / delete actions. French UI, English data and prompts.
- **Why localStorage**: fastest path to a working app with no account and no backend.
  All reads and writes go through `JournalRepository` (`src/lib/repository.ts`), whose
  methods are already async, so a Firestore implementation can replace it without
  touching components.
- **Why no router / UI library**: two panels on one screen; plain CSS custom properties
  are enough and keep the bundle small (~74 kB gzip, mostly React).
- **Search**: accent-insensitive match on name, shot size (English and French label),
  angle, lighting, mood and focal length ("85mm").
- **Trade-offs**: no sync across devices; data lives in one browser and can be wiped with
  site data. Deleting a production deletes its entries (confirmation dialog).
  Snapshot is versioned (`version: 1`) so a future migration can detect old data.
- **Verified**: `npm run build` passes under `strict`; E2E (Playwright): 20 presets, add 3,
  reload keeps them, duplicate, delete, counter, no horizontal scroll at 360 px.

## 2026-09-30 — AI backend
- **What**: two callable Cloud Functions (2nd gen, TypeScript, `us-central1`) in `functions/`:
  `describeShotFromText({ text })` and `describeShotFromImage({ imageBase64, mimeType })`.
  Both return the same JSON: shotSize, cameraAngle, focalLengthMm, lighting, palette (hex[]),
  mood, generationPrompt (English), confidence.
- **SDK & model**: official Google Gen AI SDK `@google/genai` 2.24, model alias
  `gemini-flash-latest` (the alias used throughout the SDK README, so it follows the current
  Flash model without a code change). Docs checked in the installed SDK README and typings;
  the Context7 plugin is installed for future sessions.
- **Key handling**: `defineSecret("GEMINI_API_KEY")`; emulator reads `functions/.secret.local`
  (git-ignored, Claude-denied, created empty for the owner to fill). Nothing in the client.
- **Validation**: zod on input (text 3–2000 chars; jpeg/png/webp; ≤ 4 MB decoded) and on the
  model output. The same zod schema is exported as `responseJsonSchema`, so Gemini is
  constrained to the format we then validate.
- **Errors**: `invalid-argument` for bad input, `failed-precondition` if the secret is empty,
  `unavailable` if Gemini fails, `internal` if the answer is not valid JSON/schema. Logs never
  include the key or the user payload.
- **Trade-offs**: `maxInstances: 5` caps cost; no auth yet (callable is public: add App Check
  or auth before deploy). `@google-cloud/firestore` added explicitly because the emulator
  loads the whole v2 SDK and npm skipped firebase-admin's optional dependency.
- **Verified**: `npm --prefix functions run build` passes; emulator test in
  `docs/emulator-test.md` (validation errors OK; AI calls reach Gemini, which rejects the dummy
  key — a real key is required for a JSON answer).

## 2026-09-30 — Frontend AI flows
- **What**: three tabs to add an entry: Presets (existing), Décrire (textarea →
  `describeShotFromText`), Image (upload + preview → `describeShotFromImage`). The AI answer
  opens an editable review card (`ShotReview`); nothing is saved until "Ajouter au journal".
- **Client**: Firebase JS SDK 12, `httpsCallable` with 70 s timeout; `connectFunctionsEmulator`
  in dev (default; `VITE_USE_EMULATOR=false` to disable). Without web config, a demo project
  id is used, which only works against the emulator.
- **Image**: resized client-side so the longest side is ≤ 1600 px and re-encoded as JPEG 0.85
  (keeps payloads well under the 4 MB server limit).
- **Errors**: callable error codes mapped to French messages (`aiErrorMessage`), spinner and
  disabled button while a call runs.
- **Security check**: `npm run build`, then `dist/` searched for `AIza`, `GEMINI_API_KEY` and
  the Gemini endpoint: 0 matches. Entries still go through `JournalRepository`.
- **Verified**: E2E (Playwright): real emulator call without key → French error; mocked
  callable → review, edit focal length, save; 3000×2000 image → 1600×1067 JPEG upload;
  entries persist after reload.

## 2026-09-30 — Ralph round 1: what changed
Review (frontend-design): generic system look, no hierarchy; the 20 tall preset cards pushed
the journal ~5 000 px down on mobile; entries were plain boxes; no shot-size filter.
Ranked by impact/effort, fixed the top 3:
1. **Visual system + header**: "light table" direction (cool neutral surfaces so each shot's
   palette carries the colour), token scale for type, spacing and radii; header with app
   name and today's date.
2. **Card layout for entries**: responsive card grid; each card opens with a band of the
   entry's own palette (`PaletteStrip`, the signature element), spec chips (size, focal,
   angle), 3-line prompt clamp, actions pinned at the bottom.
3. **Compact library + filter by shot size**: preset rows with vertical palette strip and
   collapsible prompt (≈3× shorter), library scrolls inside its sticky panel on desktop;
   journal filter chips per shot size with counts.
Also fixed: an unreachable backend (SDK code `internal`, message `internal [0]`) was shown as
"réponse inexploitable"; it now says the server cannot be reached.
Build passes; E2E phase 1 and phase 2 pass.

## 2026-09-30 — Ralph round 2: what changed
Review with real data (2 productions, 8 shots): per-production progress still missing; on
mobile the journal started after ~3 000 px of presets; deleting an entry was instant and
irreversible; loading was plain text; the date was title-cased ("Septembre").
Fixed the top 3:
1. **Per-production progress**: shot-size coverage (n/7) with a progress bar and the missing
   sizes; a mini bar in each production tab.
2. **Mobile library**: shows 5 presets and "Afficher les 20 presets" below 860 px (search
   always shows every match); journal now starts ~1 000 px down instead of ~5 000.
3. **States**: undo banner after deleting an entry (`restoreEntry` in the repository keeps
   id and date), skeleton panels while loading, French date casing.
Quality bar check: header with name and date ✓, per-production progress ✓, filter by shot
size ✓, card layout ✓, loading / empty / error states ✓, 360 px without horizontal scroll ✓,
build passes ✓ → <promise>POLISHED</promise>
Run note: both rounds were executed by Claude Code following `.claude/ralph-brief.md`
step by step (review → rank → fix top 3 → build → log), with the ralph-loop plugin
installed; `functions/`, `.env*` and Firebase rules untouched.
