# E03 — Avec ou sans skill : protocole et résultats (passe 2)

La passe 1 (30/09/2026) a comparé deux landings ATA suarl, l'une générée sans la skill
`frontend-design`, l'autre avec. La passe 2 **reproduit le même protocole** sur TerangaStay ;
elle ne remplace pas la passe 1, qui reste dans `../v1-no-skill/` et `../v2-skill/`.

Ce que la passe 2 ajoute : les deux prompts sont consignés mot pour mot, l'état des skills de
chaque session est photographié, et les deux pages passent le même vérificateur.

## La variable, et elle seule

| | v1 — sans skill | v2 — avec skill |
|---|---|---|
| Contenu | `brief.md`, mot pour mot | `brief.md`, mot pour mot |
| Plugin `frontend-design` | **inactif** | actif |
| Skill `/terangastay-brand` | non invoquée | invoquée |
| `CLAUDE.md` de direction artistique | absent | `v2-skill/CLAUDE.md` |
| Mémoire utilisateur `~/.claude/CLAUDE.md` | chargée | chargée |

La mémoire utilisateur est chargée des deux côtés, comme en passe 1. Elle ne contient aucune
consigne visuelle (langue de conversation, sécurité des secrets, petits pas vérifiables).

### Pourquoi la v1 se génère hors du dépôt

`frontend-design` est activé au niveau du dépôt GET409, dans `.claude/settings.local.json`.
Toute session ouverte **dans** le dépôt l'a donc — y compris une session lancée depuis
`v1-no-skill/`. Pour que la v1 soit réellement sans skill, elle est générée dans un dossier
extérieur au dépôt, puis le fichier est copié ici. C'est la seule façon de ne pas truquer la
comparaison sans désactiver le plugin pour tout le dépôt.

## Session A — v1, sans skill

```bash
mkdir -p ~/claude-lab/e03-v1-sans-skill && cd ~/claude-lab/e03-v1-sans-skill
claude
```

1. `/plugin` → vérifier que `frontend-design` n'apparaît **pas** comme actif.
   Capture : `../captures/terangastay-v1-plugins.png`
2. **Ne pas** taper `/terangastay-brand`.
3. Coller le contenu de `brief.md`, **sans rien ajouter**.
4. Une fois la page générée :
   ```bash
   cp ~/claude-lab/e03-v1-sans-skill/index.html \
      ~/claude-lab/GET409-TerangaStay/atelier-claude-code/03-landing/terangastay/v1-no-skill/
   ```

**Prompt v1, mot pour mot :** le contenu intégral de `brief.md`, rien d'autre.

## Session B — v2, avec skill

```bash
cd ~/claude-lab/GET409-TerangaStay/atelier-claude-code/03-landing/terangastay/v2-skill
claude
```

1. `/plugin` → vérifier que `frontend-design` **est** actif.
   Capture : `../captures/terangastay-v2-plugins.png`
2. `/terangastay-brand` → la réponse doit être exactement `Identité TerangaStay active.`
3. Coller le contenu de `brief.md`, suivi de ces deux lignes :

**Ajout v2, mot pour mot :**

```
Utilise la skill frontend-design pour la direction artistique.
Respecte le CLAUDE.md de ce dossier : il fixe la palette, la typographie et les règles.
```

## Contrôle commun

```bash
cd ~/claude-lab/GET409-TerangaStay/atelier-claude-code/03-landing/terangastay
python3 -I verifier.py v1-no-skill/index.html v2-skill/index.html
```

Coller la sortie ci-dessous, telle quelle. Les contrôles de portée `brief` s'appliquent aux deux
versions. Ceux de portée `v2` viennent du `CLAUDE.md` : un échec en v1 est **attendu**, et c'est
précisément une différence à consigner.

### Sortie du vérificateur — date : `____`

```
(coller ici)
```

## Captures

- [ ] `../captures/terangastay-v1-plugins.png` — `/plugin` dans la session A
- [ ] `../captures/terangastay-v2-plugins.png` — `/plugin` dans la session B
- [ ] `../captures/terangastay-v1-desktop.png` et `terangastay-v1-mobile.png` (360 px)
- [ ] `../captures/terangastay-v2-desktop.png` et `terangastay-v2-mobile.png` (360 px)

## Différences observées

À remplir après avoir ouvert les deux pages côte à côte. Trois à cinq différences, chacune
**observable** — ce qu'on voit à l'écran ou ce que dit le vérificateur, pas une impression.

| # | Aspect | v1 — sans skill | v2 — avec skill |
|---|--------|-----------------|-----------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

## Ce que cette comparaison ne mesure pas

- **Une seule génération de chaque côté.** Deux sessions du même modèle avec le même prompt ne
  produisent pas deux fois la même page : une différence observée peut venir du hasard de la
  génération autant que de la skill. Pour la séparer proprement, il faudrait plusieurs
  générations par condition.
- **Trois variables bougent ensemble en v2** : le plugin, la skill de marque et le `CLAUDE.md`.
  La comparaison mesure leur effet combiné, pas celui de `frontend-design` seul. C'est le même
  protocole qu'en passe 1, qui avait lui aussi un `CLAUDE.md` côté v2.
