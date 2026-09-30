# work/02-morning-brief — CLAUDE.md

## Purpose
A scannable daily digest, readable in under 3 minutes, before I open my laptop.

## Inputs
- Gmail: unread emails from the last 12 h (`is:unread newer_than:12h`) — **read-only**
- Google Calendar: today's events (local time, Africa/Dakar) — **read-only**
- Notion: project pages related to today's emails and events (MCP server `notion`)
- `SOUL.md` → ranked priorities (used for scoring)

## Scoring
Each item gets a score from its link to SOUL.md priorities (priority 1 = 5 pts … priority 5 = 1 pt),
+3 if it has a deadline today or tomorrow, +2 if the sender/attendee is in `vault/people/`.
Ties → the earlier deadline first.

## Output
Four sections, in this order, max 5 bullets each, one line per bullet (who · what · action):
1. **Urgent** — needs an action today, score ≥ 7
2. **Aujourd'hui** — today's meetings with a one-line prep note each
3. **Contexte** — Notion project status linked to the above
4. **FYI** — everything else worth knowing, no action

Written to:
- `vault/projects/morning-brief/YYYY-MM-DD.md` (local file, source of truth)
- a page in the Notion database **"Daily briefs"**, title `Daily brief — YYYY-MM-DD`

## Steps
1. Read SOUL.md priorities and `vault/errors.md` (known fixes).
2. Fetch inputs (Gmail, Calendar, Notion). If a connector is unavailable, write the brief with what is
   available and add a first line "Source indisponible : <name>".
3. Score, sort, write the four sections.
4. Save the local file, then create the Notion page (the database must already exist).
5. Post-run ingestion: new people → `vault/people/`, new companies → `vault/business/`,
   then update `vault/index.md` and append to `vault/log.md`.

## Permissions
- Gmail and Calendar: read-only. **Never send, reply, archive, label, delete or accept.**
- Notion: create one page per day in "Daily briefs"; never edit or delete other pages.
- Creating the "Daily briefs" database: **ask first** (once).

## Schedule
Manual: run `/morning-brief`. (Scheduling to be decided once the manual run is reliable.)

## Learned fixes
_(none yet — added by the self-correction loop, CLAUDE.md § 5)_
