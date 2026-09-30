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
