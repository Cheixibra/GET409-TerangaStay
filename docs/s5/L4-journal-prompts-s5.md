# L4 — Journal de Prompts S5 — TerangaStay

Séance 5 : Intégration MVP & RAG avec Dify · Équipe TerangaStay · 30 septembre 2026
Minimum demandé : prompt RAG Knowledge + prompt webhook Lovable + prompt de test de cohérence.
Les résultats marqués ✅ ont été constatés ; ceux marqués ⏳ sont à compléter après exécution dans Dify / Lovable.

| # | Prompt | Outil | Technique (bibliothèque S5) | Statut |
|---|--------|-------|-----------------------------|--------|
| P1 | Préparer et indexer la base RAG (données TerangaStay) | Claude + Dify Knowledge | Prompt structuré (S1 + E1) | ✅ bases indexées |
| P2 | Prompt SYSTEM du Chercheur (RAG à deux recherches) | Dify — nœud LLM | Prompt structuré + règles (Tutoriel RAG à deux recherches) | ✅ workflow publié · ✅ T1–T4 (4/4) |
| P3 | Connecter le MVP Lovable au webhook Dify | Lovable | Prompt d'intégration (E3, adapté Lovable) | ⏳ à envoyer dans Lovable |
| P4 | Test de cohérence du pipeline RAG | Dify « Exécuter test » + Claude | Zero-shot (S2) puis CoT (E5) | ✅ récupération · ✅ bout en bout (API) |

---

## P1 — Préparer et indexer la base RAG

**Objectif** : donner à l'agent des données TerangaStay réalistes, datées et sans donnée personnelle
(critère éliminatoire : base non indexée ou données génériques = 0).

**Prompt (Claude, technique S1 adaptée)**

```
J'ai besoin de données de démonstration réalistes pour la base RAG de TerangaStay
(auberge de 14 chambres à Toubab Dialaw, persona Astou Sarr, haute saison de décembre).
Produis :
1. Un CSV (en-têtes en ligne 1, séparateur virgule) avec une ligne par TYPE de chambre :
   type, numéros des chambres, capacité, équipements, prix par nuit haute et basse saison (FCFA),
   acompte par nuit déjà calculé (30 %), petit-déjeuner.
2. Un fichier .md écrit sur UNE SEULE LIGNE de moins de 1 000 caractères : les chambres libres
   pour chaque nuit du 19 au 27 décembre 2026, avec la date de mise à jour, en phrases complètes
   « nuit du [jour] [mois] : chambres libres … (Disponible) » ou « aucune chambre libre (Complet) ».
3. Construis les disponibilités pour que 4 tests aient un résultat connu :
   un séjour disponible, un séjour bloqué par une nuit complète, une demande incomplète,
   et un séjour de 2 nuits où aucune chambre du même type n'est libre les deux nuits.
Aucune donnée personnelle (pas de nom de voyageur dans le calendrier). Valeurs précalculées :
le modèle doit recopier, jamais calculer.
```

**Paramètres Dify retenus**

| Base | Fichier | Découpage | Index |
|------|---------|-----------|-------|
| `TERANGASTAY_CHAMBRES` | `terangastay_chambres.csv` (6 lignes) | séparateur `\n`, 500 tokens, chevauchement 50 | Économique (index inversé) |
| `TERANGASTAY_DISPO` | `terangastay_dispo_decembre.md` (848 caractères, 1 ligne) | séparateur `\n\n`, 1 000 tokens | Économique |

**Résultat** ✅ (constaté via l'API Dify le 30/09/2026)
- `TERANGASTAY_CHAMBRES` : 6 segments, un par type, en-têtes conservés (`Type de chambre: … ; Prix par nuit haute saison (FCFA): 28000 ; …`).
- `TERANGASTAY_DISPO` : **1 seul segment** de 848 caractères.
- Test de récupération `disponibilités chambres nuit décembre` → 1 résultat (la ligne entière) ✅.
- Test de récupération `double climatisée` → **0 résultat** ❌ ; question complète T1 → 5 résultats dont la ligne « Double climatisée » ✅.

**Analyse / itération**
- Avec le découpage 300 du tutoriel, une base de démonstration précédente coupait les lignes CSV en plusieurs morceaux
  (« Devise: » séparé de sa valeur) : d'où le découpage **1 ligne = 1 segment**.
- Le mode Économique ne retrouve pas toujours 2 mots isolés (limite n° 1 du tutoriel « RAG à deux recherches »).
  Itération : RECUP_CHAMBRES passe en **Top K 6** → le catalogue entier (6 lignes, ~1 900 caractères) est toujours
  transmis au Chercheur, qui choisit la ligne lui-même.
- Choix d'une ligne **par type** de chambre (et non par chambre) : tous les numéros d'un type arrivent ensemble.

---

## P2 — Prompt SYSTEM du Chercheur

**Objectif** : croiser la demande du voyageur avec les deux bases, sans jamais confirmer ni calculer.
Texte complet : [`../dify-s5/prompts-chercheur-redacteur.md`](../dify-s5/prompts-chercheur-redacteur.md).

**Extraits clés**
```
- Les nuits du séjour vont de la nuit de la date d'arrivée incluse à la nuit de la veille du départ incluse
  (départ le 22 = dernière nuit le 21).
- Une chambre est DISPONIBLE pour le séjour seulement si le même numéro de chambre du bon type figure
  dans la liste des chambres libres de CHAQUE nuit du séjour.
- Recopier les valeurs des blocs telles quelles : ne jamais additionner, multiplier, soustraire ni estimer.
- Ne jamais écrire « confirmée » ni « réservée ».
- Le mot INSUFFISANT ne doit JAMAIS apparaître dans une réponse suffisante.
```

**Itération par rapport au prompt S3**
| Avant (S3) | Problème | Après (S5) |
|------------|----------|------------|
| `QUESTION REÇUE : {{sys.query}}` | variable vide en mode workflow | question transmise par le message USER (`Début · query`) |
| « Rechercher … sources, URL, date de consultation » | un nœud LLM n'a pas accès au web → INSUFFISANT ou invention | recherche UNIQUEMENT dans les blocs CHAMBRES et DISPONIBILITÉS |
| aucune règle de plage de dates | un séjour couvre plusieurs nuits | règle « même chambre libre chaque nuit » |
| prix total demandé | calcul par le LLM = risque d'erreur | prix et acompte **par nuit** recopiés, total laissé à l'auberge |

**Résultat** ✅ workflow `E-Tourism RAG S5` généré ([`../dify-s5/E-Tourism-RAG-S5.yml`](../dify-s5/E-Tourism-RAG-S5.yml)),
vérifié : 9 nœuds, chaîne DÉBUT → RECUP_CHAMBRES → RECUP_DISPO → MODELE_DISPO → CHERCHEUR → SI/SINON, toutes les
variables référencées existent. Importé et publié dans Dify le 01/10/2026 ; résultats T1–T4 dans P4.

---

## P3 — Connecter le MVP Lovable au webhook Dify

**Objectif** : afficher dans le MVP la fiche de demande produite par l'agent.
Prompt complet : [`L1-prompt-lovable-webhook.md`](L1-prompt-lovable-webhook.md) (un seul prompt, Edge Function + interface).

**Adaptations par rapport au prompt E3 de la bibliothèque**
| Prompt E3 (GreenSprint) | TerangaStay | Pourquoi |
|-------------------------|-------------|----------|
| clé `app-…` dans le code du navigateur | Edge Function Lovable Cloud `ask-dify` + secret `DIFY_API_KEY` | dépôt public ; une clé côté client est lisible par tous (F12) |
| `"inputs": {}` + `"query"` à la racine | `"inputs": {"query": …}` | c'est un **workflow** (`/workflows/run`), pas un chatflow |
| affiche `response.data.answer` | affiche `data.outputs.text` ou `data.outputs.message_erreur` | noms des sorties du workflow (Sortie 2 / branche IF) |
| timeout 10 s | 30 s | 2 récupérations + 2 appels LLM |
| une zone de réponse | bandeaux Demande reçue / Conflit / Informations manquantes | contrainte MVP n° 3 : ne jamais présenter une demande comme confirmée |

**Résultat** ⏳ à compléter après envoi dans Lovable : capture de l'encadré, de T1 et de la console sans erreur.

---

## P4 — Test de cohérence du pipeline

**Étape 1 — tests zero-shot dans Dify (S2 adapté)** : questions complètes dans « Exécuter test ».

| # | Question | Attendu | Obtenu |
|---|----------|---------|--------|
| T1 | Bonjour, je voudrais une chambre double climatisée pour 2 personnes, arrivée le 20 décembre et départ le 22 décembre. C'est combien la nuit ? Je paie par Wave. | C7 · 2 nuits · 28000 FCFA/nuit · acompte 8400 · 🟡 DEMANDE REÇUE | ✅ C7 · 2 nuits · 28000 / 8400 · 🟡 DEMANDE REÇUE · message Wave/Orange Money (6,0 s) |
| T2 | Bonsoir, nous sommes deux et voudrions une case traditionnelle vue mer du 23 au 25 décembre. Nous habitons en France. | ⚠ CONFLIT (nuit du 24 Complet) · modalité étrangère | ✅ CONFLIT · nuit du 24 Complet · 35000 / 10500 · modalité étrangère ; ⚠ cite « C3 » (pas vue mer) pour la nuit du 23 (7,3 s) |
| T3 | Bonjour, vous avez de la place pour les fêtes ? | INSUFFISANT : date d'arrivée, date de départ, nombre de personnes | ✅ identique, branche SI → `message_erreur` (2,1 s) |
| T4 | Bonjour, une double climatisée pour 2 du 21 au 23 décembre svp. | ⚠ CONFLIT (C7 le 21, C8 le 22 : pas la même chambre) | ✅ CONFLIT détecté ; ⚠ prix/acompte « Non trouvé dans la base », ligne ⚠ absente en tête de fiche (7,1 s) |

**Étape 2 — audit CoT (E5 adapté), à coller dans Claude.ai avec les résultats**

```
Effectue un audit qualité de notre pipeline RAG TerangaStay. Évalue chaque dimension et donne une note /5.

NOTRE SYSTÈME :
- MVP V2 : https://elegant-builds-studio.lovable.app
- Workflow Dify : E-Tourism RAG S5 (RAG à deux recherches)
- Bases : TERANGASTAY_CHAMBRES (CSV 6 types) + TERANGASTAY_DISPO (instantané daté du 30/09/2026)

DIMENSION 1 — PRÉCISION /5 : voici les sorties de T1 et T2 : [coller]. Les numéros de chambre, prix,
acomptes et nuits sont-ils recopiés exactement depuis les bases ?
DIMENSION 2 — RÈGLES MÉTIER /5 : la réponse écrit-elle « confirmée » ? calcule-t-elle un total ?
propose-t-elle une autre chambre sans validation de la gérante ?
DIMENSION 3 — GESTION DES LIMITES /5 : sortie de T3 : [coller] ; et pour « Météo à Toubab Dialaw demain ? » :
[coller]. L'agent reconnaît-il qu'il ne sait pas ?
DIMENSION 4 — INTÉGRATION MVP /5 : temps de réponse [x s], bandeau affiché, erreurs console : [oui/non].

RÉSULTAT : note globale /20 + 3 priorités d'amélioration avant S6, une correction à la fois.
```

**Itération 1 (01/10/2026)** — premier lancement de T1–T4 via l'API du workflow publié : 4 × `status: failed`,
`model_not_found` : Groq a retiré `llama-3.1-8b-instant` le 16/08/2026 (offre gratuite) ; remplaçant officiel
`openai/gpt-oss-20b`. Correction : changer le modèle des nœuds CHERCHEUR et RÉDACTEUR dans Dify, republier, relancer.

**Itération 2 (01/10/2026)** — modèles changés dans Dify : CHERCHEUR → `openai/gpt-oss-120b`, RÉDACTEUR → `openai/gpt-oss-20b`, republié.
- T1, T2 OK au 1er lancement ; T3, T4 en échec `429 rate_limit_exceeded` (Groq gratuit : 8 000 tokens/minute pour
  gpt-oss-120b, un run ≈ 2 000–4 000 tokens). Relancés à 65 s d'intervalle → **4/4 statuts corrects**.
- Défaut 1 : chaque sortie commence par un bloc `<think>…</think>` (raisonnement interne du modèle, en anglais).
  Correction : l'Edge Function du MVP supprime ce bloc (ajouté au prompt L1).
- Défaut 2 (T4) : prix et acompte « Non trouvé dans la base » alors que la ligne « Double climatisée » existe, et la
  ligne ⚠ CONFLIT manque en tête → à corriger dans le prompt du Rédacteur : « même en CONFLIT, recopier prix et
  acompte du type demandé et commencer par la ligne ⚠ ».
- Défaut 3 (T2) : C3 (Double ventilée) cité dans la nuit du 23 pour une case vue mer → règle à renforcer dans le
  Chercheur : « ne citer que les numéros du type demandé ».

**Analyse** — Règles métier respectées sur les 4 tests : jamais « confirmée », aucun total calculé, aucune chambre
de remplacement proposée, nuits du séjour bien bornées (départ exclu). Point de vigilance pour la démo S6 :
limite de 8 000 tokens/minute ⇒ pas plus d'une demande par minute, sinon Plan B
([`plan-b-demo-s6.md`](plan-b-demo-s6.md)). Note d'audit CoT /20 à reporter après passage dans Claude.ai.
