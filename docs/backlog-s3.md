# Backlog S3 - TerangaStay

## HMW définitif

Comment pourrions-nous aider les petites structures d'hébergement touristique au Sénégal à centraliser et confirmer leurs réservations directes avec un calendrier fiable, afin d'éviter les doubles réservations et de préserver leur marge ?

## User Stories MUST

### US-01 - Fiche et lien de réservation directe

**Story :** En tant qu'Astou, je veux partager une fiche claire et un lien de réservation directe afin de recevoir des demandes sans faire passer tous les clients par une OTA.

- **Priorité :** MUST
- **Outil :** Bolt.new
- **Effort :** moyen
- **Adresse :** Pain Reliever - commissions OTA ; Gain Creator - lien direct
- **Critère d'acceptation :** un voyageur ouvre le lien sur mobile, voit l'auberge, les chambres, les tarifs et envoie une demande.

### US-02 - Calendrier par chambre

**Story :** En tant qu'Astou, je veux voir un calendrier par chambre avec un statut explicite afin de savoir ce qui est libre, demandé, en attente d'acompte ou confirmé.

- **Priorité :** MUST
- **Outil :** Bolt.new
- **Effort :** moyen
- **Adresse :** Pain Reliever - informations dispersées et doubles réservations
- **Critère d'acceptation :** quatre gérants sur cinq retrouvent l'état d'une chambre sans aide dans un scénario de six réservations.

### US-03 - Alerte de conflit et confirmation

**Story :** En tant qu'Astou, je veux être alertée lorsqu'une demande chevauche une réservation existante et envoyer une confirmation standard afin d'éviter les promesses contradictoires.

- **Priorité :** MUST
- **Outil :** Bolt.new + Dify pour le message structuré
- **Effort :** moyen
- **Adresse :** Pain Reliever - doubles réservations ; Gain Creator - statut partagé
- **Critère d'acceptation :** le conflit est signalé avant confirmation et le récapitulatif contient chambre, dates, prix, statut et contact.

## User Stories SHOULD

### US-04 - Paiement local guidé

**Story :** En tant qu'Astou, je veux afficher une instruction d'acompte adaptée au profil du voyageur afin de convertir les demandes locales et de la diaspora.

- **Priorité :** SHOULD
- **Outil :** Dify + paiement local / autre
- **Effort :** élevé
- **Adresse :** Pain Reliever - acompte difficile
- **Critère d'acceptation :** le voyageur voit une instruction claire et le statut passe à acompte attendu sans fausse confirmation.

### US-05 - Mise à jour rapide par téléphone

**Story :** En tant qu'Astou, je veux modifier le statut d'une chambre en peu d'étapes afin de garder le calendrier fiable malgré une connexion variable.

- **Priorité :** SHOULD
- **Outil :** Bolt.new ou WhatsApp assisté
- **Effort :** moyen
- **Adresse :** Pain Reliever - outil trop complexe
- **Critère d'acceptation :** Astou crée, confirme et annule une réservation en moins de cinq minutes sans aide.

## User Stories COULD

### US-06 - Synchronisation OTA

**Story :** En tant qu'Astou, je veux synchroniser automatiquement mes plateformes afin d'éviter les saisies répétées.

- **Priorité :** COULD, roadmap post-MVP
- **Outil :** API / autre
- **Effort :** élevé
- **Adresse :** Gain potentiel à valider
- **Critère d'acceptation :** ne pas construire avant d'avoir validé le flux manuel et les contraintes d'accès aux OTA.

### US-07 - Avis vérifiés

**Story :** En tant que voyageur, je veux consulter des avis vérifiés afin de choisir une auberge avec plus de confiance.

- **Priorité :** COULD, roadmap post-MVP
- **Outil :** Bolt.new
- **Effort :** élevé
- **Adresse :** Gain visibilité, hors problème central du HMW
- **Critère d'acceptation :** à définir après validation du calendrier.

## Sprint S3 - ordre de construction

- **Semaine 1 :** US-01 et US-02, puis scénario multi-canaux.
- **Semaine 2 :** US-03 et US-05 si la compréhension des statuts est validée.
- **Démo attendue :** Astou reçoit une demande directe, voit l'état de la chambre, détecte un conflit éventuel et envoie une confirmation non ambiguë.
