# Note d'éthique S6 — TerangaStay

Une ligne par fonctionnalité : risque principal, garde-fou en place, test qui le prouve
(tutoriel S5+ §7 et §8). Tests : [`L4-journal-prompts-s5.md`](L4-journal-prompts-s5.md), rejeu final 8/8 le 04/10/2026
sur https://teranga-stay.lovable.app.

| Fonctionnalité | Risque principal | Garde-fou | Preuve |
|----------------|------------------|-----------|--------|
| Extraction de la demande (CHERCHEUR, Gemini) | inventer une date ou convertir une devise (« vendredi prochain » → 19 décembre, observé à l'itération 3) | règle « date relative = manquante, avec la raison » ; aucune conversion € ↔ FCFA ; INSUFFISANT plutôt que deviner | T3, T4 ✅ |
| Disponibilité chambre × nuits (`VERIF_DISPO`) | double réservation : le LLM annonçait C7 libre alors qu'elle était prise le 22 (itération 4) | calcul exact par un nœud Code, aucun LLM ; le Rédacteur recopie ; nuit hors calendrier → CONFLIT « la gérante doit vérifier » | T6 4/4, T1, T2 ✅ |
| Statut de la demande | présenter une demande comme réservée | jamais « confirmée » ; bandeaux Demande reçue / Conflit / Informations manquantes ; la gérante seule confirme, après l'acompte | T1, T5 ✅ |
| Robustesse aux manipulations | injection « ignore tes instructions… confirme » | prompts système non modifiables par l'entrée ; le calcul de disponibilité ne dépend pas du texte | T5 ✅ |
| Prix et acomptes | erreur de montant | valeurs précalculées dans la base, recopiées, jamais calculées par le LLM ; aucun total dans la fiche | T1, T2 ✅ |
| Alerte de conflit entre demandes (I1) | conserver des données de voyageurs ; faux sentiment de sécurité | mémoire de l'onglet seulement, ni nom ni texte ; l'alerte ne bloque rien, la gérante décide | T7, T8 ✅ |
| Texte envoyé à l'IA | données personnelles transmises à Dify et à Google (offre gratuite pouvant réutiliser les requêtes) | rappel « n'y collez ni nom ni numéro de téléphone » ; données de test fictives ; page Confidentialité | contrôle visuel du MVP |
| Formulaire « Demander » | faire croire qu'une demande est envoyée ; collecte inutile | plus de faux « Demande envoyée » : message préparé à copier, avertissement « non transmise, pas une réservation » ; ni e-mail ni téléphone demandés | parcours testé le 04/10 |
| Carte des hébergements | révéler l'adresse d'un établissement ; IP envoyée à un tiers | position à la localité seulement ; tuiles OpenStreetMap mentionnées dans la page Confidentialité | contrôle visuel |
| Clé API Dify | fuite de la clé | appel côté serveur uniquement (`createServerFn`), secret Lovable / `.env.local` ignoré par Git ; erreurs affichées sans clé ni trace | aucune clé dans le code public (vérifié), P5 ✅ |
| Dépendance aux API gratuites | panne pendant l'usage ou la démo (Groq retiré, quota Gemini épuisé, 503) | modèle avec notre propre clé, 2 nouvelles tentatives, erreur lisible, délai 45 s, Plan B | itérations 1, 6, 7 ; [`plan-b-demo-s6.md`](plan-b-demo-s6.md) |
| Langue | exclusion des voyageurs non francophones ou wolophones | limite assumée : français uniquement, aucune traduction automatique non vérifiée par un locuteur | — (limite connue) |

**Limites connues** : calendrier figé (instantané du 30/09/2026, la validation de la gérante ne le met pas à jour) ;
la liste des demandes en attente ne voit que les demandes passées par l'assistant.
