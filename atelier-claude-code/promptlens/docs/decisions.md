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
