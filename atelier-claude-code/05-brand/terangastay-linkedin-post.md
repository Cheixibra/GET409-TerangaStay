# Post LinkedIn — TerangaStay (skill `/terangastay-brand`)

Notre assistant a annoncé une chambre libre alors qu'elle était déjà prise.

Trois fois sur trois. Le modèle lisait correctement le calendrier, mais croiser « la même
chambre libre chaque nuit du séjour » est un calcul d'ensembles, pas un travail de rédaction.

Nous avons donc sorti ce calcul du modèle. Un nœud de code, sans IA, croise les numéros de
chambre et les nuits du séjour. Le modèle comprend la demande et rédige la réponse ; le code
décide de la disponibilité.

Le test est repassé, et le temps de réponse est redescendu sous dix secondes.

Pour une petite auberge, une double réservation n'est pas un détail. Mieux vaut un « je ne
sais pas » qu'une promesse fausse.

L'équipe TerangaStay

#Sénégal #IA #Tourisme

---

## Auto-vérification (self-check de la skill)

| Point | Contrôle | Résultat |
|-------|----------|----------|
| 1 | Aucun mot de la banned list | 0 |
| 2 | Palette | sans objet (texte seul) |
| 3 | Se termine par une signature de la liste | « L'équipe TerangaStay » |
| 4 | Aucun fait inventé | « 3 fois sur 3 » et « sous dix secondes » viennent du journal L4, itérations 4 et 9 |
| 5 | Aucun statut présenté comme confirmé | 0 occurrence des trois statuts interdits par la skill |
| — | Emojis | 0 (limite : 1) |
| — | Hashtags | 3, dont #Sénégal (limite : 3) |
| — | Longueur du corps | 120 mots |

Sources des deux chiffres cités :
`GET409-TerangaStay/docs/s5/L4-journal-prompts-s5.md` — itération 4 (« 3 exécutions sur 3 »)
et itération 9 (« T6 9,8 s · T1 5,6 s »).
