# Traçabilité 6 Chapeaux vers VPC

| Observation ou décision | Source 6 Chapeaux | Élément VPC | Conséquence produit |
| --- | --- | --- | --- |
| Les réservations sont réparties entre cahier, Excel, WhatsApp et OTA. | Blanc | Pain : informations dispersées. | Calendrier central et source de la demande. |
| Astou ressent de l'anxiété face aux doublons. | Rouge | Pain : doubles réservations. | Statut par chambre et alerte de conflit. |
| Les commissions réduisent la marge. | Blanc + Rouge | Pain : commissions élevées. | Lien direct et mesure de la commission estimée évitée. |
| Un outil complexe serait abandonné. | Noir + Bleu | Pain : outil trop lourd. | Parcours mobile court et statuts limités. |
| Les clients veulent réserver directement. | Jaune | Gain : réservations directes. | Fiche publique partageable. |
| Wave/Orange Money ne couvrent pas tous les clients. | Blanc + Noir | Pain : acompte difficile. | Paiement local guidé et alternative à valider. |
| Un statut partagé réduit les malentendus. | Rouge + Jaune | Gain : confirmation sans ambiguïté. | Récapitulatif commun à l'auberge et au voyageur. |
| La synchronisation universelle est trop risquée pour S3. | Noir + Bleu | Élément hors MVP. | Tester d'abord la saisie et la confirmation des demandes directes. |

## Éléments non tracés à valider

- Le taux réel de commission et le montant acceptable pour un service direct doivent être vérifiés avec plusieurs auberges.
- La part des clients étrangers qui exige un paiement international doit être mesurée avant de construire une passerelle.
- La demande d'avis visibles existe dans la carte S1, mais elle n'est pas prioritaire tant que le problème de calendrier n'est pas validé.

## Synthèse

**Alignement : fort mais provisoire.** Les 6 chapeaux convergent vers la fiabilité du calendrier et la simplicité d'usage. La tension principale est que la valeur économique pousse vers plusieurs canaux, alors que la fiabilité exige de maîtriser le périmètre de synchronisation. Le MVP doit donc dire clairement ce qui est enregistré et ce qui ne l'est pas.
