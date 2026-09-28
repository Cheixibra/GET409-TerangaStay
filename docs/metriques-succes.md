# Métriques de succès du MVP

## Métrique Nord

**Taux de demandes directes confirmées sans conflit de chambre** : proportion des demandes arrivées par TerangaStay qui sont confirmées avec un calendrier cohérent et sans double réservation.

Formule : `demandes directes confirmées sans conflit / demandes directes reçues`.

Objectif de validation prototype : **au moins 70 %** sur le scénario de test, avant une mise en production plus large.

## Métriques de progression

1. **Tâches calendrier réussies** : au moins 4 gérants sur 5 retrouvent l'état d'une chambre sans aide.
2. **Délai de traitement** : au moins 80 % des demandes directes reçoivent un statut en moins de 15 minutes pendant le test.
3. **Part de demandes directes** : au moins 30 % des demandes du pilote passent par le lien TerangaStay après partage auprès des anciens clients.

## Métriques d'alerte

1. **Conflits non détectés** : plus de 5 % des scénarios multi-canaux aboutissent à une confirmation contradictoire.
2. **Abandon gérant** : plus de 30 % des gérants abandonnent une tâche parce que l'outil est trop lent, complexe ou dépend d'une connexion instable.

## Mesure de la marge

La commission évitée sera calculée séparément et présentée comme une estimation : `montant de la réservation directe x commission OTA habituelle`. Elle ne doit pas être confondue avec un revenu net garanti.

## Règles de mesure

- Les seuils sont des cibles de validation, pas des résultats déjà observés.
- Chaque test note le canal d'origine, la chambre, les dates, le statut, le temps et l'erreur éventuelle.
- Les résultats sont comparés aux hypothèses avant d'élargir le MVP.
