# L1 — Connecter le MVP Lovable à l'agent Dify (TerangaStay)

| | |
|---|---|
| Workflow Dify | **E-Tourism RAG S5** (publié) |
| URL API | `https://api.dify.ai/v1/workflows/run` |
| Clé | `app-…` du workflow → secret Lovable `DIFY_API_KEY` (jamais dans le code ni sur GitHub) |
| MVP | `[NOM-PROJET].lovable.app` — à renseigner |

## Le prompt à coller dans Lovable

```
Ajoute un « Assistant de réservation » sur la page de réservation de TerangaStay (ou sur l'Accueil).

1. Crée une Edge Function Lovable Cloud "ask-dify" qui reçoit { question }, appelle
   POST https://api.dify.ai/v1/workflows/run avec le header Authorization: Bearer <secret DIFY_API_KEY>
   et le body { "inputs": { "query": question }, "response_mode": "blocking", "user": "terangastay" },
   puis renvoie le texte de data.outputs.text, ou data.outputs.message_erreur s'il est vide.
   Demande-moi le secret DIFY_API_KEY via le formulaire de secrets ; ne l'écris jamais dans le code.

2. Interface : un champ texte « Collez la demande du voyageur (chambre, dates, nombre de personnes)… »,
   un bouton « Analyser la demande », une zone de résultat (fond gris clair, retours à la ligne conservés),
   un spinner pendant l'appel, et en cas d'échec le message rouge « Service temporairement indisponible ».

3. Au-dessus du résultat, un bandeau selon le texte reçu : « INSUFFISANT » → orange « Informations manquantes » ;
   « CONFLIT » → rouge « Conflit de chambre — ne pas confirmer » ; « DEMANDE REÇUE » → jaune « En attente de validation ».

Style cohérent avec le MVP, responsive mobile. Ne modifie aucune autre page.
```

## Tester dans le MVP

| Demande à coller | Attendu |
|------------------|---------|
| Bonjour, je voudrais une chambre double climatisée pour 2 personnes, arrivée le 20 décembre et départ le 22 décembre. C'est combien la nuit ? Je paie par Wave. | bandeau jaune · chambre C7 · 28000 FCFA/nuit |
| Bonsoir, nous sommes deux et voudrions une case traditionnelle vue mer du 23 au 25 décembre. Nous habitons en France. | bandeau rouge · nuit du 24 complète |
| Bonjour, vous avez de la place pour les fêtes ? | bandeau orange · informations manquantes |

En cas d'erreur 401 : la clé ne correspond pas au workflow **E-Tourism RAG S5** → la régénérer dans sa référence API.
