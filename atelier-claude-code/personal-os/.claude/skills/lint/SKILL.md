---
name: lint
description: Health check of the vault wiki — orphans, pages without sources, broken wikilinks, index gaps, stale pages, contradictions. Fixes only mechanical issues.
disable-model-invocation: true
---

# /lint

Check, in order, and report each finding as `severity · file · issue · proposed fix`:
1. **Index**: every page in vault/me, business, people, projects is listed once in `vault/index.md`; no index entry points to a missing page.
2. **Links**: every `[[wikilink]]` resolves; every page links to at least one other page (no orphans).
3. **Sources**: every page has a `sources` front-matter entry, and each listed source exists in `vault/sources/`.
4. **Freshness**: pages with `updated` older than 90 days.
5. **Contradictions**: the same fact with different values on two pages.
6. **Sources untouched**: nothing in `vault/sources/` was modified since ingestion (compare with log.md).

Fix automatically only: missing index lines, obviously misspelled links to an existing page.
List everything else for me. Append to `vault/log.md`: `YYYY-MM-DD HH:MM · lint · N issues, M fixed`.
If the wiki is empty, say so in one line and suggest `/ingest`.
