# Atelier Claude Code — livrables

Parcours « Atelier Claude Code » (15 épisodes, E00 à E14), réalisé le 30/09/2026 avec Claude Code 2.1.285
sur macOS (l'atelier est écrit pour Windows : les commandes PowerShell ont leur équivalent zsh).
Chaque épisode a son dossier ; l'historique git suit l'ordre des épisodes (un commit par étape).

## Parcours Essentiel (E00 → E08)

| Ép. | Sujet | Livrables | Preuve / vérification |
|-----|-------|-----------|------------------------|
| E00 | Installation | [`00-demarrer/preuves-installation.md`](00-demarrer/preuves-installation.md) | Claude Code 2.1.285 (≥ 2.1.280), aucune `ANTHROPIC_API_KEY`, connecté claude.ai en plan **Pro** |
| E01 | Premier prompt | [`01-hello/ata-card.html`](01-hello/ata-card.html) | Carte responsive (0 px de débordement à 360 px), captures dans `01-hello/captures/` |
| E02 | Modes, plan, retour arrière | Thème clair/sombre (`prefers-color-scheme` + bouton mémorisé), défi : bouton « Copier l'email » | Commits `carte ATA` puis thème ; même orange dans les deux thèmes |
| E03 | Skill frontend-design | [`03-landing/v1-no-skill`](03-landing/v1-no-skill/index.html) vs [`03-landing/v2-skill`](03-landing/v2-skill/index.html) | Plugin `frontend-design` installé (scope local) ; quiz testé de bout en bout, formulaire validé, 360 px OK ; captures `03-landing/captures/` |
| E04 | Commandes & CLAUDE.md | [`03-landing/v2-skill/CLAUDE.md`](03-landing/v2-skill/CLAUDE.md) (42 lignes), [`memoire-utilisateur.CLAUDE.md`](03-landing/memoire-utilisateur.CLAUDE.md) | Mémoire installée dans `~/.claude/CLAUDE.md` |
| E05 | Voix de marque `/ata-brand` | [`ata-brand.SKILL.md`](05-brand/ata-brand.SKILL.md), [email HTML](05-brand/email-followup.html) + [texte](05-brand/email-followup.txt), [post LinkedIn](05-brand/linkedin-post.md), [flyer A4](05-brand/flyer-atelier-xr.html) | `/ata-brand` testé dans une nouvelle session → « Identité ATA suarl active. » ; flyer au ratio 1,414 (A4) |
| E06 | Plugins Playwright + marketing | [`competitive-analysis.md`](06-plugins/competitive-analysis.md), [`marketing-plan.html`](06-plugins/marketing-plan.html), `screenshots/`, [`observations.json`](06-plugins/observations.json), [`plugin-install.log`](06-plugins/plugin-install.log) | 3 studios réels visités (Moment Factory, Superbien, Triggerfish), 11 captures ; plugin marketing désactivé après usage |
| E07 | PromptLens 1/4 : CLAUDE.md | [`promptlens/CLAUDE.md`](promptlens/CLAUDE.md) | 72 lignes (< 120), section Never |
| E08 | PromptLens 2/4 : protections + app | `.gitignore`, `.env.example`, `.claude/settings.json` (deny), app phase 1 | `git check-ignore -v .env` OK ; **Claude a refusé de lire `.env`** (`permission_denials: Read`) ; `npm run build` OK ; E2E : persistance après rechargement |

## Épisodes Avancé (E09 → E14)

| Ép. | Sujet | Livrables | Preuve / vérification |
|-----|-------|-----------|------------------------|
| E09 | PromptLens 3/4 : Gemini | `promptlens/functions/` (2 callables, `defineSecret`, zod), onglets Décrire / Image | [`docs/emulator-test.md`](promptlens/docs/emulator-test.md) : émulateur prêt, validations OK, appel Gemini atteint ; **0 clé dans `dist/`** |
| E10 | Boucle Ralph (2 tours) | [`.claude/ralph-brief.md`](promptlens/.claude/ralph-brief.md), branche `ralph` fusionnée | [`docs/decisions.md`](promptlens/docs/decisions.md) « Ralph round 1/2 », `<promise>POLISHED</promise>` ; captures avant/après dans `promptlens/docs/captures/` |
| E11 | Skill externe + agent Python | [`11-agent/`](11-agent/) : `.venv`, noyau `agents-lab`, [`notebooks/agent_lab.ipynb`](11-agent/notebooks/agent_lab.ipynb) | Import SDK OK, `.env` ignoré ; mémoire vérifiée (Q2 : 1 message sans mémoire, 3 avec) |
| E12 | Agent personnel | [`personal-os/`](personal-os/) : CLAUDE.md (69 lignes), SOUL.md (modèle), vault, 4 skills | `/lint` reconnu dans une vraie session ; `vault/log.md` daté |
| E13 | Brief du matin | `work/02-morning-brief/CLAUDE.md`, skill `/morning-brief`, MCP Notion ajouté | `claude mcp list` : notion « Needs authentication » |
| E14 | Relecteur sécurité | [`.claude/agents/firebase-reviewer.md`](promptlens/.claude/agents/firebase-reviewer.md) | [`docs/security-audit.md`](promptlens/docs/security-audit.md) : audit par le sous-agent (0 critique, 2 hauts), aucun fichier modifié |

## Ce qui reste à faire de ton côté

Ces étapes demandent ton compte, ta clé ou ta voix. Elles ne pouvaient pas être faites à ta place :

1. **Captures interactives** demandées au formateur : `/status`, `/usage`, `/context`, plan mode, `Échap Échap` (E00–E02, E04, E07).
2. **E05** : valider ou remplacer la palette, les polices et la tagline marquées *(proposé)* dans `~/.claude/skills/ata-brand/SKILL.md`, et remplacer `05-brand/hero.jpg` (image de remplacement étiquetée) par une vraie photo de production.
3. **E09** : coller ta clé Gemini dans `promptlens/functions/.secret.local`, puis
   `firebase emulators:start --only functions --project demo-promptlens` et `npm run dev` pour obtenir une vraie fiche.
4. **E11** : coller une clé API Anthropic dans `11-agent/.env`, puis *Run All* sur le noyau **agents-lab**.
   L'API est facturée à l'usage, **séparément de ton abonnement Pro**.
5. **E12** : lancer `/setup` (interview SOUL.md), déposer ton CV dans `personal-os/vault/sources/cv.pdf`, puis `/ingest`,
   et ouvrir `personal-os/vault` dans Obsidian.
6. **E13** : `/mcp` → notion → *Authenticate* ; connecter Gmail et Google Agenda dans claude.ai (Paramètres → Connecteurs) ; lancer `/morning-brief`.
7. **E14** : prioriser les correctifs de l'audit (H1 App Check, H2 config de production) avant tout déploiement.

## Écarts assumés par rapport à l'atelier

- **macOS au lieu de Windows** : même commandes Claude Code ; zsh au lieu de PowerShell.
- **Un seul dépôt** : les dossiers `claude-lab/<exercice>` de l'atelier sont ici des sous-dossiers de `atelier-claude-code/`.
  Les plugins en « scope local » s'appliquent donc à la racine du dépôt (`.claude/settings.local.json`, non versionné).
- **E06** : aucune liste de concurrents n'était fournie ; trois studios réels ont été choisis. Les visites ont été
  faites avec Playwright 1.48 (Chromium, compatible macOS 12) ; le plugin Playwright est installé pour tes sessions.
- **E09** : Context7 est installé, mais la doc du SDK `@google/genai` a été vérifiée dans le README et les typings du paquet installé.
  Modèle : alias `gemini-flash-latest` (celui de la doc officielle).
- **E10** : les deux tours ont été exécutés pas à pas selon `ralph-brief.md` (revue → classement → 3 corrections → build → note),
  plutôt que via `/ralph-loop` dans une session imbriquée, pour ne pas dépenser deux fois ton quota.
- **E11** : variante Anthropic proposée par l'atelier (skill intégrée `/claude-api`, SDK officiel `anthropic`, modèle `claude-opus-5-5`)
  au lieu de l'OpenAI Agents SDK du cours.
- **E12** : dépôt public → seules la structure et les modèles vides sont versionnés ; `personal-os/.gitignore` exclut tes données personnelles.
