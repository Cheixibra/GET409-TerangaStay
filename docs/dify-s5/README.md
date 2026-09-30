# TerangaStay — Dify S5 : RAG à deux recherches (guide pas à pas)

Application du « Tutoriel Dify : RAG à deux recherches » (GET 409 — S5) à TerangaStay.
Sert **US-03** (alerte de conflit + confirmation structurée) et le HMW définitif :
*centraliser et confirmer les réservations directes avec un calendrier fiable, afin d'éviter les doubles réservations.*

## Fichiers

| Fichier | Rôle | Réglage Dify |
|---------|------|--------------|
| [`terangastay_chambres.csv`](terangastay_chambres.csv) | Base **recherchée** CHAMBRES : 6 types regroupant les 14 chambres (numéros, capacité, équipements, prix, acompte) | longueur 300, chevauchement 50 |
| [`terangastay_dispo_decembre.md`](terangastay_dispo_decembre.md) | Base **fixe** DISPONIBILITÉS : chambres libres par nuit du 19 au 27 décembre, instantané daté, 1 ligne, 848 caractères | personnalisé : identifiant `\n\n`, longueur 1000 |
| [`prompts-chercheur-redacteur.md`](prompts-chercheur-redacteur.md) | SYSTEM du Chercheur et du Rédacteur + 4 tests | — |

Une ligne **par type** de chambre (et non par chambre). RECUP_CHAMBRES est en **Top K 6** : le catalogue entier (6 lignes) est toujours transmis, car la recherche par mots-clés du mode Économique renvoie 0 résultat pour `double climatisée` (testé le 30/09/2026 ; la question complète, elle, remonte la bonne ligne).

**Déjà fait par API le 30/09/2026** : bases `TERANGASTAY_CHAMBRES` (6 segments, en-têtes conservés) et `TERANGASTAY_DISPO` (1 segment de 848 caractères) créées et indexées ; [`E-Tourism-RAG-S5.yml`](E-Tourism-RAG-S5.yml) contient le workflow complet avec ces deux bases déjà sélectionnées. Il reste : Studio → **Importer DSL** → ce fichier, puis l'étape F (tests).

---

## Étape A — Créer les deux bases (15 min)

1. Dify → **Connaissance** → **+ Créer des Connaissances** → importer `terangastay_chambres.csv`.
2. Découpage : **longueur 300**, **chevauchement 50** → **Enregistrer & Traiter**. Nommer la base `TERANGASTAY_CHAMBRES`.
3. **+ Créer des Connaissances** → importer `terangastay_dispo_decembre.md`.
4. Découpage **personnalisé** : identifiant `\n\n`, **longueur 1000** → **Enregistrer & Traiter**. Nommer `TERANGASTAY_DISPO`.
5. Attendre 🟢 **Disponible** sur les deux documents.

✅ Vérification A
- `TERANGASTAY_CHAMBRES` → Test de Récupération avec la question T1 complète → la ligne « Double climatisée, C6 C7 C8 » remonte (les 2 mots seuls ne suffisent pas en mode Économique).
- `TERANGASTAY_DISPO` → le document affiche **1 seul segment** ; Test de Récupération `disponibilités chambres nuit décembre` le remonte.

## Étape B — Variable ENV (2 min)

1. Workflow → barre du haut → **ENV** → **+ Ajouter**.
2. Type **String** · Nom `requete_dispo` · Valeur `disponibilités chambres nuit décembre` → Enregistrer.

## Étape C — Deux nœuds Récupération (10 min)

| Réglage | 1ᵉʳ nœud | 2ᵉ nœud |
|---------|----------|---------|
| Nom | `RECUP_CHAMBRES` | `RECUP_DISPO` |
| Texte de la requête | `Début · query` | `ENV · requete_dispo` |
| Connaissances | `TERANGASTAY_CHAMBRES` **seule** | `TERANGASTAY_DISPO` **seule** |
| Paramètres | Top K **6** (tout le catalogue) · seuil de score désactivé | Top K **3** · seuil de score désactivé |

1. Si ton nœud Récupération actuel contient plusieurs bases : garder `TERANGASTAY_CHAMBRES` seule, le renommer `RECUP_CHAMBRES`.
2. Cliquer le **+** du trait entre `RECUP_CHAMBRES` et `CHERCHEUR` → **Récupération de connaissances** → régler comme ci-dessus.
3. Vérifier que **ÉTAPE SUIVANTE** de `RECUP_DISPO` n'est pas vide.

## Étape D — Nœud Modèle Jinja2 (5 min)

1. **+** après `RECUP_DISPO` → **Modèle** (icône `{ }`). Le nommer `MODELE_DISPO`.
2. VARIABLES DE SAISIE : supprimer `arg1` (🗑) → ajouter `donnees` = `RECUP_DISPO · result`.
3. CODE — tout remplacer par :
   ```
   {% for item in donnees %}{{ item.content }}
   {% endfor %}
   ```
4. Relier le bord droit de `MODELE_DISPO` au bord gauche du `CHERCHEUR`.

✅ Vérification B–D : DÉBUT → RECUP_CHAMBRES → RECUP_DISPO → MODELE_DISPO → CHERCHEUR, liste de contrôle sans erreur.

## Étape E — Brancher le Chercheur et le Rédacteur (15 min)

**CHERCHEUR**
1. Champ **CONTEXTE** (haut du panneau) = `RECUP_CHAMBRES · result`.
2. Message **USER** : `{x}` → `Début · query`.
3. SYSTEM : coller le prompt « SYSTEM du CHERCHEUR » de [`prompts-chercheur-redacteur.md`](prompts-chercheur-redacteur.md), puis :
   - effacer `[[MODELE]]`, curseur à sa place, taper `/` → **Modèle** → **output** ;
   - effacer `[[CONTEXTE]]`, taper `/` → **Contexte** (n'apparaît que si le champ CONTEXTE est rempli).

**SI / SINON** : inchangé — condition `CHERCHEUR · text` **contient** `INSUFFISANT`.
**SORTIE (IF)** : `message_erreur` = `CHERCHEUR · text`.

**RÉDACTEUR**
1. SYSTEM : coller le prompt « SYSTEM du RÉDACTEUR ».
2. Message **USER** : `{x}` → `CHERCHEUR · text`.

✅ Vérification E : CONTEXTE = `RECUP_CHAMBRES · result` (pas `query`) · badges Modèle et Contexte visibles en bas du SYSTEM · USER = `query` · aucune variable tapée à la main.

## Étape F — Tester et lire la TRACE (15 min)

Dans **Exécuter test**, lancer les 4 questions du tableau « Tests » de [`prompts-chercheur-redacteur.md`](prompts-chercheur-redacteur.md), une par une.

| Nœud | ENTRÉE attendue | SORTIE attendue |
|------|-----------------|-----------------|
| RECUP_CHAMBRES | `"query": "<la question complète>"` | la ligne du type demandé (ex. Double climatisée) |
| RECUP_DISPO | `"query": "disponibilités chambres nuit décembre"` | 1 morceau = toute la ligne des disponibilités |
| MODELE_DISPO | `donnees` : une liste | `output` : la ligne des disponibilités en texte |
| CHERCHEUR | SYSTEM avec les blocs DISPONIBILITÉS et CHAMBRES remplis | fiche complète, date « 30 septembre 2026 » |

En cas d'échec : TRACE nœud par nœud d'abord, puis le « Prompt de débogage » (section 8 du tutoriel).
Échec le plus probable ici : **T4** (plusieurs nuits) → cause n° 11 (règle de correspondance) : renforcer la phrase
« le même numéro de chambre … de CHAQUE nuit du séjour » dans l'étape 3 du Chercheur.

Puis **Publier → Publier une mise à jour**.

---

## Template étudiant (section 9 du tutoriel) — rempli pour TerangaStay

| Placeholder | TerangaStay |
|-------------|-------------|
| [DONNEE1] — base recherchée | CHAMBRES (types de chambres, prix, acomptes) |
| Fichier de la base recherchée | `terangastay_chambres.csv` (6 lignes, 14 chambres) |
| [DONNEE2] — base fixe | DISPONIBILITÉS (chambres libres par nuit, instantané daté) |
| Fichier de la base fixe (1 ligne) | `terangastay_dispo_decembre.md` (848 caractères) |
| Variable ENV | `requete_dispo` = `disponibilités chambres nuit décembre` |
| Règle de correspondance | « nuit du [jour] [mois] » pour chaque nuit, de l'arrivée incluse au départ exclu ; même numéro libre toutes les nuits |
| T1 — valeur disponible | double climatisée du 20 au 22 déc → C7, 🟡 DEMANDE REÇUE |
| T2 — valeur bloquante | case vue mer du 23 au 25 déc → ⚠ CONFLIT (nuit du 24 Complet) |
| T3 — question incomplète | « Vous avez de la place pour les fêtes ? » → INSUFFISANT |

## Checklist avant dépôt L2

- [ ] `TERANGASTAY_CHAMBRES` 🟢 Disponible · Test de Récupération conforme
- [ ] `TERANGASTAY_DISPO` 🟢 Disponible · 1 seul segment
- [ ] Variable ENV `requete_dispo` (String)
- [ ] RECUP_CHAMBRES : requête = query · base CHAMBRES seule · Top K 6
- [ ] RECUP_DISPO : requête = ENV · base DISPO seule
- [ ] MODELE_DISPO : `donnees` = RECUP_DISPO · result · `arg1` supprimé · code Jinja collé
- [ ] CHERCHEUR : CONTEXTE = RECUP_CHAMBRES · result · badges Modèle et Contexte dans le SYSTEM · USER = query
- [ ] SORTIE (IF) : `message_erreur` = CHERCHEUR · text
- [ ] Liste de contrôle à 0
- [ ] T1, T2, T3 (et T4) conformes — captures RÉSULTAT + TRACE de RECUP_DISPO
- [ ] La fiche affiche « Données mises à jour le 30 septembre 2026 » (contrainte MVP n° 2)
- [ ] Aucune sortie n'écrit « confirmée » (contrainte MVP n° 3)
- [ ] Workflow publié · URL Dify notée
- [ ] Captures L2 : canvas complet + bases indexées + agent connecté

## Limites à mentionner dans L2

- **Instantané, pas calendrier vivant** : la base DISPONIBILITÉS est une photo datée ; en production, la disponibilité
  viendra du calendrier de l'app (US-02), pas d'un fichier importé.
- **Pas de total calculé** : le modèle recopie prix et acompte par nuit ; le total est calculé par l'app ou par la gérante.
- **L'outil ne tranche pas** : en cas de CONFLIT, aucune alternative n'est proposée automatiquement (VPC).
- **Données de démonstration** réalistes (persona Astou, 14 chambres, Toubab Dialaw) à valider avec des gérants réels.
