# Atelier Claude Code — livrables

## Deux passes

**Passe 1 — 30/09/2026.** Les quinze épisodes (E00 à E14) ont été réalisés avec les exemples
prescrits par l'atelier : le studio fictif **ATA suarl** et l'application de démonstration
**PromptLens**. Ils n'étaient pas adaptés à TerangaStay ; le professeur l'a relevé à juste titre.

**Passe 2 — du 13 au 19/10/2026, ré-ancrage sur TerangaStay.** Chaque épisode qui pouvait l'être a
été refait sur le vrai projet. Principe : **récolter plutôt qu'inventer** — palette, vocabulaire,
règles d'honnêteté et données viennent du code en production et des documents publiés du projet,
pas d'un atelier. Toute valeur qui ne peut pas être tracée jusqu'à une source porte « (proposé) ».

Les livrables de la passe 1 restent en place, **non modifiés**, à côté de ceux de la passe 2 :
l'avant/après se lit dans chaque dossier, et l'historique git du 30/09 n'a pas été réécrit.

Réalisé avec Claude Code sur macOS (l'atelier est écrit pour Windows : les commandes PowerShell ont
leur équivalent zsh).

## Parcours Essentiel (E00 → E08)

| Ép. | Sujet | Passe 1 (30/09) | Passe 2 — TerangaStay |
|-----|-------|-----------------|-----------------------|
| E00 | Installation | [`00-demarrer/preuves-installation.md`](00-demarrer/preuves-installation.md) — Claude Code 2.1.285, aucune `ANTHROPIC_API_KEY`, plan **Pro** | — générique, rien à ré-ancrer |
| E01 | Premier prompt | [`01-hello/ata-card.html`](01-hello/ata-card.html) — carte responsive, 0 px de débordement à 360 px | [`01-hello/terangastay-card.html`](01-hello/terangastay-card.html) — thème clair récolté, contraste AA mesuré |
| E02 | Modes, plan, retour arrière | thème clair/sombre mémorisé, bouton « Copier l'email » ; même orange dans les deux thèmes | même fichier qu'E01 ; thème sombre « (proposé) », clé de mémoire distincte |
| E03 | Skill frontend-design | [`v1-no-skill`](03-landing/v1-no-skill/index.html) vs [`v2-skill`](03-landing/v2-skill/index.html), quiz testé, 360 px OK | [`03-landing/terangastay/`](03-landing/terangastay/comparaison.md) — brief, direction artistique, vérificateur, protocole ; **les deux pages restent à générer** |
| E04 | Commandes & CLAUDE.md | [`v2-skill/CLAUDE.md`](03-landing/v2-skill/CLAUDE.md), [`memoire-utilisateur.CLAUDE.md`](03-landing/memoire-utilisateur.CLAUDE.md) | [`terangastay/v2-skill/CLAUDE.md`](03-landing/terangastay/v2-skill/CLAUDE.md) ; la mémoire utilisateur, générique, est inchangée |
| E05 | Voix de marque | [`ata-brand.SKILL.md`](05-brand/ata-brand.SKILL.md) + e-mail, post, flyer A4 ; `/ata-brand` → « Identité ATA suarl active. », flyer au ratio 1,414 | [`terangastay-brand.SKILL.md`](05-brand/terangastay-brand.SKILL.md) + [e-mail](05-brand/terangastay-email-demande.html), [post](05-brand/terangastay-linkedin-post.md), [flyer](05-brand/terangastay-flyer-reservation-directe.html) |
| E06 | Plugins Playwright + marketing | [`competitive-analysis.md`](06-plugins/competitive-analysis.md) — trois studios XR réels, 11 captures, plugin marketing désactivé après usage | [`06-plugins/terangastay/`](06-plugins/terangastay/competitive-analysis.md) — Booking, Airbnb, Jumia Travel, Beds24, Smoobu |
| E07 | CLAUDE.md de projet | [`promptlens/CLAUDE.md`](promptlens/CLAUDE.md) — 72 lignes (< 120), section Never | `CLAUDE.md` du **dépôt applicatif** — preuve : [`07-08-14-terangastay/`](07-08-14-terangastay/README.md) |
| E08 | Protections | `.gitignore`, `.env.example`, `deny` sur `.env` — Claude a refusé de lire `.env` ; `npm run build` OK | dépôt applicatif : **vraies failles colmatées** — `.env` n'était pas ignoré |

## Épisodes Avancé (E09 → E14)

| Ép. | Sujet | Passe 1 (30/09) | Passe 2 — TerangaStay |
|-----|-------|-----------------|-----------------------|
| E09 | PromptLens 3/4 : Gemini | `promptlens/functions/`, [`emulator-test.md`](promptlens/docs/emulator-test.md), 0 clé dans `dist/` | — non ré-ancré (voir plus bas) |
| E10 | Boucle Ralph | [`ralph-brief.md`](promptlens/.claude/ralph-brief.md), deux tours, `<promise>POLISHED</promise>` | — non ré-ancré (voir plus bas) |
| E11 | Skill externe + agent Python | [`11-agent/`](11-agent/), notebook `agent_lab.ipynb` ; import du SDK OK, `.env` ignoré, mémoire vérifiée | — générique, rien à ré-ancrer |
| E12 | Agent personnel | [`personal-os/`](personal-os/) : CLAUDE.md, SOUL.md, vault, 4 skills ; `/lint` reconnu, `vault/log.md` daté | doublon de la charte ATA remplacé par un pointeur ; le reste est générique |
| E13 | Brief du matin | `work/02-morning-brief/`, skill `/morning-brief`, MCP Notion ; `claude mcp list` : notion « Needs authentication » | — générique, rien à ré-ancrer |
| E14 | Relecteur sécurité | [`firebase-reviewer.md`](promptlens/.claude/agents/firebase-reviewer.md), [audit PromptLens](promptlens/docs/security-audit.md) : 0 critique, 2 hauts, aucun fichier modifié | sous-agent `terangastay-reviewer` + [audit vérifié](07-08-14-terangastay/security-audit.md) du vrai produit |

## Ce que la passe 2 a récolté, et d'où

| Épisode | Valeur reprise | Source dans le projet |
|---------|----------------|-----------------------|
| E05, E01, E03 | palette oklch, couleurs de statut, polices | `elegant-builds-studio/src/styles.css` |
| E05, E03 | accroche « Des séjours réservés en direct, chez ceux qui vous accueillent. » | page d'accueil en ligne (`src/routes/index.tsx`) |
| E05, E03 | interdits : jamais « confirmée », « réservée », « garanti » ; jamais de total | `docs/s5/note-ethique-s6.md` |
| E05, E06 | ce que le projet ne promet pas | `docs/hmw-definitif.md`, section « Non-objectifs » |
| E03, E05 | établissements, zones, types, prix et dates de catalogue | `elegant-builds-studio/src/data/stays.ts` |
| E05 | chambres C1–C14 et acomptes par nuit | `docs/dify-s5/terangastay_chambres.csv` |
| E05 | photographie du flyer | `elegant-builds-studio/src/assets/` |

## Ce que la passe 2 a trouvé en chemin

Le ré-ancrage n'a pas seulement changé des noms : appliquer les techniques au vrai produit a mis au
jour de vrais défauts.

- **E08 — le dépôt applicatif fuyait.** `.env` et `.env.production` n'étaient pas ignorés par git ;
  seul `.env.local` l'était, par accident. Corrigé, avec la preuve avant/après.
- **E14 — le bandeau d'alerte pouvait mentir.** Le sous-agent a trouvé seul, sans indice, que le
  bandeau était déduit de la prose du modèle au lieu du verdict calculé par `VERIF_DISPO` : un vrai
  conflit pouvait s'afficher en jaune, « En attente de validation ». Corrigé et testé avant/après.
- **E14 — un faux positif utile.** L'agent a déclaré `.env.example` absent : la règle `deny` d'E08
  le lui cachait. La règle est gardée volontairement large, et documentée.
- **E01 — une règle de la charte était fausse.** La terre cuite n'atteint que 4,18:1 sur blanc et
  échoue au WCAG AA ; mesuré, puis corrigé dans la skill.
- **E06 — le taux de commission de Booking.com n'est pas public** (page partenaire en 403), alors
  que l'absence de Wave et d'Orange Money chez les concurrents est documentée. Le positionnement
  s'appuie donc sur le paiement, pas sur la commission.

## Ce qui n'a pas été ré-ancré, et pourquoi

- **E09, PromptLens (Vite + Firebase + Gemini)** — le porter sur TerangaStay voudrait dire réécrire
  le vrai produit dans une autre pile. La réponse à la critique a été d'appliquer les **techniques**
  au vrai dépôt (E07, E08, E14), pas de porter l'application.
- **E10, boucle Ralph** — une boucle autonome qui modifie l'interface d'une application publiée,
  synchronisée avec Lovable et notée, présente un risque sans gain proportionné. Les deux tours de
  la passe 1 prouvent la technique.
- **E11, E12, E13** — outillage personnel, générique par construction : rien de propre à ATA, donc
  rien de propre à TerangaStay. Seul le doublon de la charte ATA dans `personal-os/` a été traité.
- **E00** — preuves d'installation, sans contenu de marque.

## Ce qui reste à faire de ton côté

Ces étapes demandent ton compte, ta clé ou ta voix. Elles ne pouvaient pas être faites à ta place.

**Passe 2**
1. **E03** — générer les deux landings selon [`comparaison.md`](03-landing/terangastay/comparaison.md) :
   la v1 hors du dépôt (sinon `frontend-design` est actif), la v2 avec la skill ; puis lancer le
   vérificateur et remplir le tableau des différences.
2. **Captures de la passe 2** — listées en cases à cocher dans
   [`07-08-14-terangastay/README.md`](07-08-14-terangastay/README.md),
   [`06-plugins/terangastay/competitive-analysis.md`](06-plugins/terangastay/competitive-analysis.md)
   et [`03-landing/terangastay/comparaison.md`](03-landing/terangastay/comparaison.md) ; plus
   `01-hello/captures/terangastay-card-{desktop,mobile}.png` et
   `05-brand/captures/terangastay-{email,flyer}.png`.

**Passe 1, toujours en attente**
3. **Captures interactives** demandées au formateur : `/status`, `/usage`, `/context`, plan mode, `Échap Échap`.
4. **E09** : coller ta clé Gemini dans `promptlens/functions/.secret.local`, puis
   `firebase emulators:start --only functions --project demo-promptlens` et `npm run dev`.
5. **E11** : coller une clé API Anthropic dans `11-agent/.env`, puis *Run All* sur le noyau **agents-lab**.
   L'API est facturée à l'usage, **séparément de ton abonnement Pro**.
6. **E12** : lancer `/setup` (interview SOUL.md), déposer ton CV dans `personal-os/vault/sources/cv.pdf`,
   puis `/ingest`, et ouvrir `personal-os/vault` dans Obsidian.
7. **E13** : `/mcp` → notion → *Authenticate* ; connecter Gmail et Google Agenda dans claude.ai ; lancer `/morning-brief`.
8. **E14 (PromptLens)** : prioriser les correctifs de l'audit (H1 App Check, H2 config de production).

L'ancien point « valider la palette, les polices et la photo d'E05 » est résolu par la passe 2 :
ces valeurs sont récoltées du produit en production, et le flyer utilise une vraie photographie.

## Écarts assumés par rapport à l'atelier

- **macOS au lieu de Windows** : mêmes commandes Claude Code ; zsh au lieu de PowerShell.
- **Un seul dépôt d'atelier** : les dossiers `claude-lab/<exercice>` de l'atelier sont ici des sous-dossiers
  de `atelier-claude-code/`. Les plugins en « scope local » s'appliquent donc à la racine du dépôt
  (`.claude/settings.local.json`, non versionné).
- **Deux dépôts en passe 2** : les livrables d'atelier vivent ici, mais les fichiers Claude Code réels
  (E07, E08, E14) vivent dans le dépôt applicatif `elegant-builds-studio`, là où Claude Code les lit.
  Ce dépôt-ci en garde la preuve : SHA des commits, transcriptions et instantanés vérifiables par `diff`.
- **Lovable** : le dépôt applicatif est synchronisé avec Lovable. Son historique publié n'est jamais
  réécrit ; les modifications arrivent par branches et fusions sans rebase.
- **E06** : la passe 1 a choisi trois studios réels faute de liste fournie. La passe 2 a collecté par
  pages publiques, sans navigateur : pas de captures automatiques, et chaque valeur non lue sur une
  page est marquée « non observé ».
- **E09** : Context7 est installé, mais la doc du SDK `@google/genai` a été vérifiée dans le README et les
  typings du paquet installé. Modèle : alias `gemini-flash-latest`.
- **E10** : les deux tours ont été exécutés pas à pas selon `ralph-brief.md`, plutôt que via
  `/ralph-loop` dans une session imbriquée, pour ne pas dépenser deux fois le quota.
- **E11** : variante Anthropic proposée par l'atelier (skill `/claude-api`, SDK `anthropic`) au lieu de
  l'OpenAI Agents SDK du cours.
- **E12** : dépôt public → seules la structure et les modèles vides sont versionnés ;
  `personal-os/.gitignore` exclut les données personnelles.
