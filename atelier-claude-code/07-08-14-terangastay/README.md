# E07 · E08 · E14 — ré-ancrés sur le vrai dépôt (passe 2)

> **Les fichiers de cet épisode ne vivent pas ici.** Ils vivent dans le dépôt applicatif
> `elegant-builds-studio`, parce que c'est là que Claude Code les lit : un `CLAUDE.md` rangé
> dans un dossier d'atelier ne sert à rien, et une règle `deny` hors du projet ne protège rien.
> Ce dossier n'en est que la **preuve**.

La passe 1 (30/09/2026) a réalisé E07, E08 et E14 sur `promptlens/`, l'application de démonstration
du cours. Elle reste en place, intacte. La passe 2 applique les mêmes techniques au vrai produit —
et il s'est avéré que les trous qu'elle comble étaient réels, pas pédagogiques.

## Où sont les fichiers, et dans quel commit

Dépôt : `elegant-builds-studio`, branche `chore/claude-code-setup`.

| Épisode | Fichier dans le dépôt applicatif | Commit |
|---------|----------------------------------|--------|
| E08 | `.gitignore` (bloc « Secrets — never commit ») | `9f6f097` |
| E08 | `.env.example` (nouveau) | `9f6f097` |
| E08 | `.claude/settings.json` (nouveau) | `9f6f097` |
| E07 | `CLAUDE.md` (nouveau, 110 lignes) | `50c26f7` |
| — | `package.json` : script `typecheck` | `2ce0a23` |
| E14 | `.claude/agents/terangastay-reviewer.md` (nouveau, 30 lignes) | `216b20b` |

## Instantanés gelés

Les trois fichiers ci-dessous sont des copies **octet pour octet**. Volontairement sans en-tête
ajouté : un en-tête rendrait la copie non comparable, alors que le but est justement de pouvoir
la vérifier. La source de vérité est le dépôt applicatif ; **ne pas éditer ces copies.**

| Copie ici | Source |
|-----------|--------|
| `snapshot-CLAUDE.md` | `elegant-builds-studio/CLAUDE.md` |
| `snapshot-claude-settings.json` | `elegant-builds-studio/.claude/settings.json` |
| `snapshot-env.example` | `elegant-builds-studio/.env.example` |
| `snapshot-terangastay-reviewer.md` | `elegant-builds-studio/.claude/agents/terangastay-reviewer.md` |

Vérification par un correcteur qui a les deux dépôts :

```bash
cd ~/claude-lab/elegant-builds-studio
diff CLAUDE.md                ../GET409-TerangaStay/atelier-claude-code/07-08-14-terangastay/snapshot-CLAUDE.md
diff .claude/settings.json     ../GET409-TerangaStay/atelier-claude-code/07-08-14-terangastay/snapshot-claude-settings.json
diff .env.example              ../GET409-TerangaStay/atelier-claude-code/07-08-14-terangastay/snapshot-env.example
diff .claude/agents/terangastay-reviewer.md \
     ../GET409-TerangaStay/atelier-claude-code/07-08-14-terangastay/snapshot-terangastay-reviewer.md
```

Quatre sorties vides = les copies sont à jour.

## E08 — ce qui était réellement troué

Ce n'est pas un exercice reconstitué : le dépôt applicatif fuyait.

**Avant** (`.gitignore` sur `main`, avant le commit `9f6f097`) :

```
$ git show main:.gitignore | grep -cE '^\.env$'
0
$ git show main:.gitignore | grep -cE '^\.env\.\*$'
0
$ git show main:.gitignore | grep -cE '^package-lock\.json$'
0
```

Seul `.env.local` était couvert, et par accident : la règle générique `*.local`.
`.env` et `.env.production` ne l'étaient pas. `package-lock.json` n'était ni suivi ni ignoré,
alors que `bun.lock` est versionné — un `npm install` malencontreux aurait cassé l'installation
côté Lovable.

**Après** (sur la branche) :

```
$ git check-ignore -v .env
.gitignore:23:.env	.env
$ git check-ignore -v .env.local
.gitignore:24:.env.*	.env.local
$ git check-ignore -v .env.production
.gitignore:24:.env.*	.env.production
$ git check-ignore -v package-lock.json
.gitignore:35:package-lock.json	package-lock.json
$ git check-ignore -v .dev.vars
.gitignore:26:.dev.vars	.dev.vars
```

Et `.env.example` reste suivi, grâce à la règle de négation `!.env.example` :

```
$ git add --dry-run .env.example
add '.env.example'
```

> Piège rencontré : `git check-ignore -v .env.example` **sort 0** et affiche la règle `!.env.example`,
> ce qui ressemble à « le fichier est ignoré ». C'est faux — `check-ignore` renvoie 0 dès qu'un motif
> correspond, même négatif. Le contrôle fiable est `git add --dry-run`.

## E07 — ce que le `CLAUDE.md` dit de vrai

Deux points où il aurait été facile d'écrire une règle fausse :

- **`npm run lint`** renvoie aujourd'hui ~214 erreurs qui sont *toutes* du formatage Prettier,
  plus 6 avertissements `react-refresh` dans des fichiers shadcn/ui générés. Écrire « le lint doit
  passer avant chaque commit » aurait créé une règle insuivable dès la première ligne. Le fichier
  dit la vérité et désigne `npx tsc --noEmit` comme la vraie barrière.
- **`AGENTS.md`** est réécrit par Lovable. Le `CLAUDE.md` y renvoie pour les trois invariants
  d'architecture au lieu de les recopier, sinon les deux fichiers divergeraient.

Il consigne aussi la mesure de contraste faite en phase 2 : `--accent` (terre cuite) n'atteint que
4,18:1 sur blanc et échoue au WCAG AA pour du texte normal ; `--accent-strong` est requis pour le
petit texte, les liens et les boutons pleins.

## Captures à prendre

À faire dans une session Claude Code **ouverte sur `elegant-builds-studio`**, après avoir
récupéré la branche — les règles `deny` d'un projet sont lues au démarrage de la session.

- [ ] `captures/deny-env-local.png` — demander la lecture de `.env.local` et photographier le refus
      de permission. C'est la preuve que `.claude/settings.json` agit.
- [ ] `captures/check-ignore.png` — la sortie de `git check-ignore -v .env` dans le terminal.
- [ ] `captures/sous-agent-audit.png` — le sous-agent `terangastay-reviewer` en train de rendre son rapport.

## E14 — sous-agent de sécurité

Le sous-agent de la passe 1, `promptlens/.claude/agents/firebase-reviewer.md`, **ne transfère pas** :
TerangaStay n'utilise pas Firebase mais Dify, une fonction serveur et Cloudflare Workers. Il reste
en place, intact, et redevient utile le jour où un projet Firebase revient.

Le remplaçant, `terangastay-reviewer`, garde la forme de la passe 1 — `tools: Read, Grep, Glob`,
`model: sonnet`, « Never edit files. » — avec six contrôles re-pointés sur ce produit :

1. frontière du secret `DIFY_API_KEY` (jamais en `VITE_*`, jamais dans `.output/`)
2. validation Zod et plafond de longueur sur chaque `createServerFn`
3. surfaces d'erreur : ni clé, ni en-tête, ni trace renvoyés au client (`extractErrorMessage`)
4. invariants d'honnêteté : aucun statut « confirmée », aucun total côté client, l'objet
   `reservation` issu uniquement de la sortie `VERIF_DISPO` validée
5. données personnelles : rien de persisté, `pending-requests.ts` en mémoire d'onglet
6. surface de déploiement : secret par `wrangler secret`, aucune clé versionnée

Les contrôles 4 et 5 sont ce qui rend cet agent spécifique au projet et pas seulement générique :
il audite les règles de la note d'éthique, pas uniquement des fuites de secret.

### Lancer l'audit — à faire de ton côté

Un agent défini dans `.claude/agents/` est chargé au **démarrage** de la session. Il n'était donc
pas disponible dans la session qui l'a écrit : l'audit doit être lancé dans une session neuve,
ouverte sur `elegant-builds-studio`, après avoir récupéré la branche.

```bash
cd ~/claude-lab/elegant-builds-studio
git checkout chore/claude-code-setup
claude            # nouvelle session
```

Puis, dans la session : `/agents` doit lister `terangastay-reviewer`. Demande-lui l'audit, et
colle son rapport dans `security-audit.md` à côté de ce fichier.

- [ ] `security-audit.md` — le rapport, avec sévérité, `fichier:ligne`, cause et correctif
- [ ] vérifier qu'il n'a rien modifié : `git status` doit rester propre après son passage

Ce que le rapport devrait relever, si l'agent fait son travail : le bandeau de
`src/components/agent-search.tsx` est décidé par `getBanner(text)`, qui cherche une
sous-chaîne dans la prose du Rédacteur, alors que le verdict déterministe est disponible dans
`reservation.statut`. C'est le contrôle 4. Ne pas corriger avant que l'agent l'ait signalé :
le rapport est la preuve notée de l'épisode.
