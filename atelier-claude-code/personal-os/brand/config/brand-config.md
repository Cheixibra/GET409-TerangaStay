<!-- Pointer only. Brand values live in the installed skills, never here (CLAUDE.md § 4). -->

# Brand kit — where the values live

This file used to duplicate `~/.claude/skills/ata-brand/SKILL.md` in full (66 lines).
Two copies of a palette drift; one of them is then wrong without anyone noticing.
So this is a pointer, and the skills are the single source of truth.

| Context | Skill to invoke | Source of its values |
|---------|-----------------|----------------------|
| TerangaStay — the real project (auberges, direct booking requests) | `/terangastay-brand` | harvested from production code and project docs |
| ATA suarl — the fictional studio used by the Claude Code workshop (pass 1, 30/09/2026) | `/ata-brand` | proposed during the workshop, never validated |

Rules:
- Invoke the skill at the start of the conversation; do not paste its values into other files.
- Anything written for TerangaStay uses `/terangastay-brand`. ATA is course fiction and stays
  available only so the pass-1 workshop evidence remains reproducible.
- The templates in `../templates/` are brand-neutral scaffolds: the voice, the palette,
  the sign-off and the hashtags all come from whichever skill is active.
