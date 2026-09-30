---
name: new-automation
description: Scaffold a new automation in work/NN-name/ — its own CLAUDE.md playbook, a triggering skill, output locations and post-run ingestion — from a short brief.
disable-model-invocation: true
argument-hint: "<brief of the automation>"
---

# /new-automation <brief>

1. Restate the automation in 3 lines (purpose, inputs, output) and list the connectors it needs.
   Check they are available (`/mcp`); if one is missing, stop and say how to connect it.
2. Pick the next number: `work/NN-<kebab-name>/` (NN = highest existing + 1, starting at 01).
3. Create `work/NN-name/CLAUDE.md` with: Purpose · Inputs · Output (paths) · Steps · Permissions
   (read-only by default on external accounts) · Schedule (manual unless I say otherwise) · Learned fixes (empty).
4. Create `.claude/skills/<name>/SKILL.md` with `disable-model-invocation: true` that runs the playbook
   end to end, then performs post-run ingestion (CLAUDE.md § 6) and the self-correction loop (§ 5).
5. **Ask before creating anything in an external tool** (database, page, calendar, folder).
6. Append to `vault/log.md`: `YYYY-MM-DD HH:MM · new-automation · work/NN-name created`.
7. Tell me to restart Claude so the new skill appears in the `/` menu, then how to run it.
