# L1 — MVP V2 : connecter Lovable à l'agent Dify (TerangaStay)

Adaptation du « Tutoriel Webhook : Lovable ↔ Dify » (GET 409 — S5) au projet TerangaStay.

| | |
|---|---|
| Équipe | TerangaStay (Cheikh Ibra, Mame Fatou) |
| MVP Lovable | `[NOM-PROJET].lovable.app` — à renseigner |
| Workflow Dify | **E-Tourism RAG S5** (importé depuis [`../dify-s5/E-Tourism-RAG-S5.yml`](../dify-s5/E-Tourism-RAG-S5.yml)) |
| URL API Dify | `https://api.dify.ai/v1/workflows/run` (identique pour tous) |
| Entrée du workflow | `inputs.query` (texte du voyageur) |
| Sorties du workflow | `outputs.text` (fiche + message, branche normale) · `outputs.message_erreur` (branche INSUFFISANT) |
| Résultat visé | Un voyageur colle sa demande, TerangaStay affiche la fiche de demande **non confirmée** et l'alerte de conflit éventuelle |

## Étape 1 — Récupérer la clé API du workflow (Dify)

1. Studio → **E-Tourism RAG S5** → **Publier** (en haut à droite) → **Publier une mise à jour**.
2. **Publier** → flèche → **Accéder à la référence API**.
3. **Clé API** (en haut à droite) → **+ Créer une nouvelle clé secrète** → copier (format `app-…`, affichée une seule fois).
4. Ne jamais la coller dans un fichier du dépôt GitHub (public).

## Étape 2 — Prompt à coller dans Lovable (version recommandée : clé côté serveur)

Pourquoi : dans le prompt du tutoriel, la clé `app-…` est écrite dans le code du navigateur. N'importe quel
visiteur peut alors la lire (F12) et consommer le quota Dify. Ici, la clé reste dans les secrets de Lovable Cloud.

```
Dans mon MVP TerangaStay, ajoute une fonctionnalité « Assistant de réservation » sur la page de
réservation de l'auberge (ou sur l'Accueil si cette page n'existe pas).

BACKEND (Lovable Cloud) :
1. Active Lovable Cloud si ce n'est pas déjà fait.
2. Crée une Edge Function nommée "ask-dify" qui :
   - reçoit en POST un JSON { "question": string } ;
   - refuse une question vide ou de plus de 1000 caractères (erreur 400) ;
   - appelle https://api.dify.ai/v1/workflows/run en POST avec les headers
     Authorization: Bearer <secret DIFY_API_KEY> et Content-Type: application/json,
     et le body { "inputs": { "query": question }, "response_mode": "blocking",
     "user": "terangastay-" + un identifiant aléatoire } ;
   - renvoie { "answer": data.outputs.text ?? data.outputs.message_erreur ?? "",
     "insufficient": true si le texte commence par "INSUFFISANT" } ;
   - renvoie une erreur 502 avec un message court si Dify répond autre chose que 200 ;
   - abandonne l'appel à Dify après 30 secondes.
3. La clé Dify est un secret nommé DIFY_API_KEY : demande-la-moi via le formulaire de secrets,
   ne l'écris jamais dans le code ni dans un fichier du projet.

INTERFACE À AJOUTER :
1. Un encadré « Assistant de réservation TerangaStay » avec un champ texte multiligne,
   placeholder : "Collez la demande du voyageur (type de chambre, dates d'arrivée et de départ, nombre de personnes)..."
2. Un bouton "Analyser la demande" dans la couleur principale du MVP.
3. Une zone de résultat sous le formulaire (fond gris clair) qui affiche le texte en conservant
   les retours à la ligne.
4. Un spinner de chargement et le bouton désactivé pendant la requête.
5. Si la réponse commence par "INSUFFISANT", afficher un bandeau orange
   "Informations manquantes" suivi du texte.
6. Si la réponse contient "CONFLIT", afficher un bandeau rouge "⚠ Conflit de chambre — ne pas confirmer".
7. Si la réponse contient "DEMANDE REÇUE", afficher un bandeau jaune "Demande reçue — en attente de validation".
8. Un message d'erreur rouge si l'appel échoue :
   - erreur réseau ou 502 : "Service temporairement indisponible"
   - délai dépassé (> 30 s) : "La réponse prend trop de temps — réessayez"
9. Une mention discrète sous la zone : "Réponse générée par un assistant IA à partir des
   disponibilités mises à jour le 30 septembre 2026. Seule l'auberge confirme une réservation."

STYLE : cohérent avec le reste du MVP, responsive mobile, lisible avec une connexion faible
(pas d'animation lourde).
Ne modifie aucune autre page.
```

Quand Lovable demande le secret `DIFY_API_KEY` : coller la clé `app-…` de l'étape 1 dans le formulaire sécurisé de Lovable (pas dans le chat).

### Variante du tutoriel (secours, prototype uniquement)

Si Lovable Cloud n'est pas disponible sur ton plan : prompt du tutoriel avec les corrections propres à TerangaStay.
La clé sera visible dans le navigateur — à mentionner dans la note d'éthique et à supprimer après la démo.

```
Dans mon MVP TerangaStay, ajoute une fonctionnalité de consultation de l'agent IA sur la page de réservation.

INTERFACE À AJOUTER :
1. Un champ de texte avec placeholder :
   "Collez la demande du voyageur (chambre, dates, nombre de personnes)..."
2. Un bouton dans la couleur principale du MVP : "Analyser la demande"
3. Une zone de résultat sous le formulaire (fond gris clair), retours à la ligne conservés
4. Un spinner de chargement pendant la requête
5. Un message d'erreur rouge si la requête échoue

CONNEXION WEBHOOK DIFY :
URL : https://api.dify.ai/v1/workflows/run
Méthode : POST
Headers :
  Authorization: Bearer [COLLER_VOTRE_CLÉ_API_ICI]
  Content-Type: application/json
Body JSON :
  { "inputs": {"query": valeurDuChampTexte},
    "response_mode": "blocking",
    "user": "terangastay-" + Date.now() }

TRAITEMENT DE LA RÉPONSE :
- Succès : afficher response.data.outputs.text, ou response.data.outputs.message_erreur s'il est vide
- Erreur réseau : "Service temporairement indisponible"
- Timeout (> 30 s) : "La réponse prend trop de temps — réessayez"
STYLE : cohérent avec le MVP. Responsive mobile.
```

Délai porté de 10 s (tutoriel) à 30 s : le workflow TerangaStay enchaîne 2 récupérations et 2 appels LLM.

## Étape 3 — Tester dans le MVP (3 tests obligatoires + 1 bonus)

| # | Demande à coller | Ce qui doit s'afficher |
|---|------------------|------------------------|
| T1 — prix / disponibilité | Bonjour, je voudrais une chambre double climatisée pour 2 personnes, arrivée le 20 décembre et départ le 22 décembre. C'est combien la nuit ? Je paie par Wave. | Bandeau jaune · chambre **C7** · 2 nuits · 28000 FCFA/nuit · acompte 8400/nuit · Wave/Orange Money |
| T2 — conflit | Bonsoir, nous sommes deux et voudrions une case traditionnelle vue mer du 23 au 25 décembre. Nous habitons en France. | Bandeau rouge · nuit du 24 Complet · aucune alternative proposée · modalité pour l'étranger |
| T3 — hors-base / incomplet | Bonjour, vous avez de la place pour les fêtes ? | Bandeau orange · INSUFFISANT : date d'arrivée, date de départ, nombre de personnes |
| T4 — bonus multi-nuits | Bonjour, une double climatisée pour 2 du 21 au 23 décembre svp. | Bandeau rouge · aucune chambre du type libre les deux nuits |

## Checklist de validation

- [ ] Encadré « Assistant de réservation TerangaStay » visible sur la page choisie
- [ ] Champ + bouton fonctionnels, bouton désactivé pendant l'appel
- [ ] Spinner affiché pendant la requête
- [ ] T1, T2, T3 conformes (captures : question saisie + réponse affichée)
- [ ] Aucune clé `app-…` dans le code du navigateur (F12 → Sources → rechercher `app-`) — version recommandée
- [ ] Console sans erreur (pas de 401, pas de CORS)
- [ ] MVP publié : URL `…lovable.app` reportée dans le formulaire e-Academy

## Dépannage

| Problème | Solution |
|----------|----------|
| 401 Unauthorized | Clé `app-…` erronée ou d'une autre application → régénérer dans la référence API du workflow **E-Tourism RAG S5** |
| 400 « query is required » | Le body doit contenir `inputs.query` (pas `query` à la racine : c'est un workflow, pas un chatflow) |
| Réponse vide / undefined | Lire `data.outputs.text` **ou** `data.outputs.message_erreur` (branche INSUFFISANT) |
| Timeout | Vérifier que le workflow est **publié** ; le premier appel peut être plus lent |
| Erreur CORS (variante secours) | Passer par la version Edge Function : l'appel serveur n'est pas soumis au CORS |
