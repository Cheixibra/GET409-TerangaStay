# Plan B — démo S6 si l'API Dify ne répond pas

Exigé par le syllabus (prompt S6 de la bibliothèque S5). Réponses **simulées**, cohérentes avec les bases
`TERANGASTAY_CHAMBRES` et `TERANGASTAY_DISPO` (instantané du 30/09/2026). À annoncer comme simulées au jury.

**Phrase à dire (≈ 15 s)** : « Le service Dify ne répond pas en ce moment. Je vous montre la réponse exacte que le
workflow produit sur cette même demande, enregistrée lors de nos tests ; le schéma d'architecture montre le trajet. »

## Réponse simulée 1 — T1 (disponible)

```
🟡 DEMANDE REÇUE — en attente de votre validation
Chambre proposée : C7 · Double climatisée
Arrivée : 20 décembre · Départ : 22 décembre · 2 nuits · 2 personnes
Prix par nuit : 28000 FCFA · Acompte par nuit : 8400 FCFA
Détail des nuits : nuit du 20 décembre : C7 libre · nuit du 21 décembre : C7 libre
Profil de paiement : Sénégal · Données mises à jour le 30 septembre 2026
Points à confirmer : aucun

Message pour le voyageur :
Bonjour, merci pour votre demande. La chambre double climatisée C7 est libre du 20 au 22 décembre
(2 nuits), à 28000 FCFA la nuit, acompte de 8400 FCFA par nuit. Votre demande est bien reçue ; elle
sera confirmée par l'auberge après réception de l'acompte. Acompte possible par Wave ou Orange Money ;
l'auberge vous envoie le numéro.
```

## Réponse simulée 2 — T2 (conflit)

```
⚠ CONFLIT DE CHAMBRE — ne pas confirmer sans vérifier le calendrier
Type : Case traditionnelle vue mer (C13, C14) · 23 → 25 décembre · 2 nuits · 2 personnes
Détail des nuits : nuit du 23 décembre : C13 libre · nuit du 24 décembre : aucune chambre libre (Complet)
Prix par nuit : 35000 FCFA · Acompte par nuit : 10500 FCFA
Profil de paiement : étranger / diaspora · Données mises à jour le 30 septembre 2026

Message pour le voyageur :
Bonsoir, merci pour votre demande. La case traditionnelle vue mer n'est pas libre toutes les nuits
du 23 au 25 décembre. L'auberge revient vers vous rapidement avec une réponse. L'auberge vous
indiquera une autre modalité de paiement de l'acompte.
```

## Réponse simulée 3 — T3 (incomplète)

```
INSUFFISANT : date d'arrivée, date de départ, nombre de personnes
```
