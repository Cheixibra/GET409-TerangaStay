---
name: ingest
description: Ingest a raw source from vault/sources/ into the wiki — create or update pages about me, people, companies and projects, then update index.md and log.md.
disable-model-invocation: true
argument-hint: "<path in vault/sources/>"
---

# /ingest <path>

1. Check the path is inside `vault/sources/`. If not, ask me to copy the file there first. **Never modify the source.**
2. Read the source fully (PDF, text, email export, notes).
3. Extract, with the exact place in the source for each fact:
   - facts about me → `vault/me/` (role, skills, history, goals)
   - people → `vault/people/<first-last>.md`
   - organisations → `vault/business/<name>.md`
   - projects → `vault/projects/<name>.md`
4. For each page: create it or update it (merge, don't duplicate); front matter `type`, `updated`, `sources`;
   link related pages with `[[wikilinks]]`. If a new fact contradicts an existing one, keep both with their sources and flag it.
5. Update `vault/index.md` (one line per new page, grouped by type).
6. Append to `vault/log.md`: `YYYY-MM-DD HH:MM · ingest · <source> → N pages created, M updated`.
7. Reply with the list of pages created/updated and any contradiction found.
