---
name: morning-brief
description: Build today's morning brief from unread Gmail (12 h), today's Calendar and related Notion projects, scored against SOUL.md priorities, saved to the vault and mirrored to Notion "Daily briefs". Read-only on Gmail and Calendar.
disable-model-invocation: true
---

# /morning-brief

Follow `work/02-morning-brief/CLAUDE.md` exactly, step by step. Reminders:
- Read `vault/errors.md` and the playbook's "Learned fixes" before starting.
- Gmail and Calendar are **read-only**: no send, reply, archive, label, delete, accept.
- If the Notion database "Daily briefs" does not exist, ask me before creating it; never create it silently.
- Notion page title: `Daily brief — YYYY-MM-DD` (today's date, Africa/Dakar).
- Local file: `vault/projects/morning-brief/YYYY-MM-DD.md`, overwritten if it already exists for today.
- On failure, run the self-correction loop (root CLAUDE.md § 5) and log the fix.
- Finish with: the four sections, the Notion page link, and the list of vault pages created or updated.
