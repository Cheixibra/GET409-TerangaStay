Crée une landing page pour TerangaStay, dans un seul fichier `index.html`.

## Le produit

TerangaStay met en relation des voyageurs avec de petites structures d'hébergement indépendantes
au Sénégal — auberges, campements, maisons d'hôtes — pour qu'ils leur écrivent en direct, sans
plateforme intermédiaire entre eux. Le voyageur envoie une demande ; c'est la gérante de
l'établissement qui confirme le séjour, après réception d'un acompte payable par Wave ou
Orange Money.

## Contraintes techniques

- Un seul fichier `index.html`, sans aucune dépendance externe : ni framework, ni CDN, ni police
  ou image distante. La page doit s'ouvrir par double-clic, hors ligne.
- Tout le texte en français.
- Utilisable entièrement au clavier, focus visible.
- Aucune barre de défilement horizontale à 360 px de large.

## Sections, dans cet ordre

1. **En-tête** — le nom TerangaStay et des liens d'ancre vers : Trouver un séjour, Comment ça
   marche, Pourquoi en direct, Préparer une demande.

2. **Accroche** — titre, mot pour mot :
   « Des séjours réservés en direct, chez ceux qui vous accueillent. »
   Sous-titre, mot pour mot :
   « Écrivez directement aux auberges, campements et maisons d'hôtes du Sénégal. C'est
   l'établissement qui vous répond, et la gérante qui confirme. »
   Un bouton qui mène au quiz.

3. **Trouvez votre séjour** — un quiz en trois étapes, une question à la fois, avec un indicateur
   de progression qui montre les trois étapes et la réponse déjà donnée à chacune
   (« à choisir » tant qu'elle ne l'est pas). On peut revenir à l'étape précédente.

   | Étape | Question | Options, dans cet ordre |
   |-------|----------|-------------------------|
   | 1 | « Où voulez-vous séjourner ? » | Dakar et environs · Petite Côte · Casamance · Sine-Saloum · Nord |
   | 2 | « Quel type d'hébergement ? » | Chambre double · Chambre familiale · Bungalow double · Bungalow familial · Chambre standard |
   | 3 | « Quel budget par nuit ? » | Jusqu'à 35 000 FCFA · De 36 000 à 45 000 FCFA · Plus de 45 000 FCFA |

   Après la troisième réponse, afficher **une piste**, pas une offre :
   - en titre : le type choisi et la zone choisie, par exemple « Chambre double · Petite Côte » ;
   - « Capacité habituelle : » suivi de la capacité du type (tableau ci-dessous) ;
   - « Dans le catalogue de démonstration, pour <zone> : » puis la liste des établissements de
     cette zone, chacun sous la forme
     « <nom>, <lieu> — <type>, <prix> FCFA la nuit (catalogue du <date>) »
     avec deux mentions : « type demandé » ou « autre type », et « dans votre budget » ou
     « hors de votre budget » ;
   - s'il n'y en a aucun : « Aucun établissement de démonstration dans cette zone pour l'instant. » ;
   - toujours, mot pour mot :
     « Ceci n'est pas une disponibilité. L'établissement vous répond, et c'est la gérante qui
     confirme votre séjour après réception de l'acompte. » ;
   - un bouton « Préparer ma demande » vers la section 6, et un bouton « Recommencer ».

4. **Comment ça marche** — quatre étapes numérotées, mot pour mot :
   1. « Choisissez votre destination » — « Explorez les régions selon votre projet de voyage. »
   2. « Comparez les hébergements » — « Vérifiez les tarifs, les services et la date de dernière
      mise à jour. »
   3. « Envoyez une demande directe » — « Transmettez vos dates et vos besoins à l'établissement. »
   4. « Recevez une confirmation » — « La réservation n'existe qu'après la réponse de l'auberge. »

5. **Pourquoi en direct** — trois points, mot pour mot :
   - « Vous écrivez à la personne qui vous accueille » — « Votre demande va directement à
     l'établissement, sans plateforme intermédiaire entre vous. »
   - « Acompte par Wave ou Orange Money » — « L'établissement vous envoie le numéro ; vous payez
     depuis votre téléphone. »
   - « Une demande n'est pas une réservation » — « Tant que l'acompte n'est pas reçu, la chambre
     reste en attente, et on vous le dit franchement. »

6. **Préparer une demande** — un formulaire qui **n'envoie rien** : il prépare un message que le
   voyageur copie et envoie lui-même à l'établissement.
   - Champs : Prénom (facultatif) · Arrivée (date) · Départ (date) · Nombre de personnes (1 à 4) ·
     Type d'hébergement (les cinq types de l'étape 2) · Message.
   - **Ne demander ni adresse e-mail, ni numéro de téléphone.**
   - Validation, avec un message d'erreur sous le champ concerné : le départ doit être après
     l'arrivée ; le message fait au moins 10 caractères.
   - Si le quiz a été rempli, pré-sélectionner le type choisi.
   - À l'envoi : afficher le message préparé et un bouton « Copier le message ».
   - Afficher en permanence, mot pour mot : « Ce formulaire n'envoie rien : il prépare un message
     que vous copiez et envoyez vous-même à l'établissement. Ce n'est pas une réservation. »

7. **Pied de page** — « © TerangaStay » et, mot pour mot :
   « Données de démonstration à confirmer avant publication. Tarifs et disponibilités à confirmer
   auprès de l'établissement avant tout paiement. »

## Données — à reprendre telles quelles

| Nom | Lieu | Zone | Type | Capacité | Prix par nuit | Catalogue du |
|-----|------|------|------|----------|---------------|--------------|
| Astou Lodge | Toubab Dialaw | Dakar et environs | Chambre double | 2 personnes | 35 000 FCFA | 28/09/2026 |
| Teranga Beach Camp | Saly | Petite Côte | Chambre familiale | 4 personnes | 55 000 FCFA | 28/09/2026 |
| Maison de la Lagune | Somone | Petite Côte | Chambre double | 2 personnes | 40 000 FCFA | 28/09/2026 |
| Résidence Casamance | Cap Skirring | Casamance | Bungalow double | 2 personnes | 42 000 FCFA | 25/09/2026 |
| Campement du Saloum | Toubacouta | Sine-Saloum | Bungalow familial | 4 personnes | 48 000 FCFA | 27/09/2026 |
| Baobab Guesthouse | Saint-Louis | Nord | Chambre standard | 2 personnes | 30 000 FCFA | 28/09/2026 |

Capacité habituelle par type : Chambre double, Bungalow double et Chambre standard → 2 personnes ;
Chambre familiale et Bungalow familial → 4 personnes.

Budget : « Jusqu'à 35 000 FCFA » couvre les prix ≤ 35 000 ; « De 36 000 à 45 000 FCFA » couvre
36 000 à 45 000 ; « Plus de 45 000 FCFA » couvre les prix > 45 000.

## Règles d'honnêteté — non négociables

- Ne jamais écrire « disponible », « confirmée », « réservée » ni « garanti » pour décrire l'état
  d'une chambre ou d'une demande. Seule la gérante confirme.
- Ne jamais afficher de statut de disponibilité pour un établissement.
- Les prix sont recopiés du tableau, toujours avec leur date de catalogue. Ne jamais additionner,
  multiplier ni afficher de total.
- N'inventer aucun numéro de téléphone, adresse e-mail, lien de paiement, avis, note, témoignage
  ou chiffre.
