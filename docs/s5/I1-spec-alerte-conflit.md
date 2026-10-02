# I1 — Alerte de conflit entre demandes en attente (module D, tutoriel S5+)

Fonctionnalité innovante S5+, choisie parmi 3 propositions (grille §5.3 : 22/25, la plus alignée sur le HMW).

**User story** — Pour Astou (gérante), quand deux demandes arrivées par des canaux différents visent la même chambre pour
au moins une même nuit, l'assistant le signale avant qu'elle ne valide la seconde, afin de ne pas accepter deux
voyageurs pour une seule chambre.

## Critères d'acceptation
1. Chaque analyse « DEMANDE REÇUE » ajoute une ligne `C7 · Double climatisée · nuits du 20 et 21 déc. · analysée à 14:02`
   avec un bouton « Retirer » ; les CONFLIT et INSUFFISANT ne bloquent aucune chambre et ne sont pas ajoutés.
2. Si une nouvelle « DEMANDE REÇUE » porte sur une chambre et au moins une nuit déjà présentes, bandeau rouge
   `⚠ C7 déjà demandée pour la nuit du 21 décembre par une demande en attente (analysée à 14:02) — ne pas confirmer les deux` ;
   la nouvelle ligne est ajoutée et marquée ⚠.
3. Liste en mémoire seulement (ni localStorage, ni base) : vide après rechargement ; aucune donnée personnelle
   (ni nom, ni téléphone, ni texte du voyageur).

## Dify
- `VERIF_DISPO` : 2e sortie `reservation` (JSON calculé par le code, jamais par le LLM) :
  `{"statut":"DISPONIBLE","chambre":"C7","type":"Double climatisée","nuits":["2026-12-20","2026-12-21"]}`.
- `Sortie 2` : variable de sortie `reservation` → l'API renvoie `data.outputs.text` et `data.outputs.reservation`.

## Application (Lovable, 1 prompt)
- Fonction serveur : renvoyer aussi `reservation` (JSON validé, `null` si invalide, sans jamais bloquer la fiche).
- Composant de l'assistant : liste en mémoire, comparaison chambre × nuits, bandeau, bouton « Retirer ».

## Tests
| # | Entrées (dans l'ordre) | Attendu | Critère |
|---|------------------------|---------|---------|
| T7 | T1 (double climatisée 20→22 déc.) puis `Bonsoir, une chambre double climatisée pour 2 personnes du 21 au 22 décembre, je paie par Orange Money.` | 2e : DEMANDE REÇUE C7 + bandeau rouge « C7 déjà demandée pour la nuit du 21 décembre » | 2 lignes, la 2e ⚠ |
| T8 | T1 · `Bonjour, une chambre twin climatisée pour 2 personnes du 20 au 22 décembre.` · T6 · rechargement | C9 sans alerte ; T6 (CONFLIT) non ajouté ; liste vide après rechargement | 0 alerte · 2 lignes puis 0 |

## Note d'éthique S6
| Fonctionnalité | Risque | Garde-fou | Test |
|---|---|---|---|
| I1 alerte de conflit | données de voyageurs (loi 2008-12) ; faux sentiment de sécurité (la liste ne voit que les demandes passées par l'assistant) | mémoire de session, sans nom ni texte ; l'alerte ne bloque rien, Astou décide | T8 étape 4 ; T7 |
