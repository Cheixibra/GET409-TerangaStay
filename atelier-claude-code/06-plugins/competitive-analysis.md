# Analyse concurrentielle — ATA suarl

Visites faites le 30/09/2026 avec Playwright (Chromium headless), pages publiques uniquement : aucune connexion, aucun formulaire, cookies refusés quand un bouton « Decline/Refuser » existait. Données brutes (titres, textes, couleurs calculées, liens) : [`observations.json`](observations.json).
Tout ce qui n'a pas été vu sur les pages visitées est marqué **non observé**.

Concurrents retenus (aucune liste n'était fournie ; choix : un leader de l'immersif, un studio créa-tech francophone, un studio d'animation africain) :

| Id | Studio | Base | Pages visitées |
|----|--------|------|----------------|
| C1 | Moment Factory | Montréal | https://momentfactory.com/ · https://momentfactory.com/collections/all |
| C2 | Superbien | Paris / New York | https://www.superbien.studio/ · https://www.superbien.studio/case-studies |
| C3 | Triggerfish | Le Cap | https://www.triggerfish.com/ · /originals/ · /about-us/ · /academy |

## C1 — Moment Factory

Captures : `screenshots/c1-momentfactory-hero.jpg`, `c1-momentfactory-home.jpg`, `c1-momentfactory-work.jpg`

- **Message hero** : vidéo plein écran (projection sous une coupole) avec le logo anniversaire « Moment Factory 25 — 25 years of doing it in public » (hero). Texte d'introduction : « At Moment Factory, we bring people together. Our Custom Experiences and Moment Factory Originals pioneer new forms of entertainment around the world. » (home)
- **Palette** : noir et blanc, gris ; un jaune vif `rgb(255,234,0)` apparaît sur la page projets. La couleur vient des images (observations.json, `topColors`).
- **CTA principal** : « Explore all projects » (et « Click here for a surprise ») en boutons contour blancs (hero).
- **Structure d'offre** : deux lignes, *Originals* (attractions à billetterie) et *Custom Experiences* (services à l'échelle). Entrée par secteur : Themed Entertainment, Cultural & Educational, Transportation Hubs, Public Spaces (home). Page projets filtrable par type, industrie, région, lieu, solution : « 232 found » (work).
- **Tarifs** : non observé.
- **Langues** : anglais et français (`hreflang` en/fr, sélecteur « EN »).
- **Travaux ouest-africains** : non observé sur les pages visitées (aucune mention d'Afrique relevée).
- **Preuve sociale** : citations de presse sur la page d'accueil (h2 entre guillemets).

## C2 — Superbien

Captures : `screenshots/c2-superbien-hero.jpg`, `c2-superbien-home.jpg`, `c2-superbien-case-studies.jpg` (12 000 premiers pixels d'une page de 72 000 px ; le texte complet de la page, dont les mentions Nigeria et African Games, est dans `observations.json`)

- **Message hero** : « (Welcome) We craft moving images for unframed formats », titre géant sur fond noir, vignette « Play reel » (hero). Présentation : « For over 14 years […] a hybrid creative studio that develops artwork and commissioned projects for international brands, institutions » (home).
- **Palette** : quasi-noir `#0A0A0A` et blanc `#FDFDFD`, gris ; monochrome (observations.json).
- **CTA principal** : « Let's talk ↗ » en haut à gauche, plus « Play reel » (hero). Navigation principale cachée derrière « Menu ».
- **Structure d'offre** : pas de liste de services visible ; page « Our work — (What we do) » : « We design and produce motion-driven visual experiences… » puis une grille de cas classés par format (videomapping, live show, film/motion design, brand experience, immersive exhibition) (case-studies). Entités annexes : Superlab, Playground, Journal (home).
- **Tarifs** : non observé.
- **Langues** : anglais et français (sélecteur EN/FR).
- **Travaux ouest-africains** : oui, deux cas listés : « Centennial of Nigeria's Unification » (videomapping) et « 11th African Games opening ceremony » (live show) (case-studies). Aucun projet au Sénégal observé.
- **Signal IA** : un article de journal « midjourney-infinity » (lien sur la home) : non ouvert, contenu non observé.

## C3 — Triggerfish

Captures : `screenshots/c3-triggerfish-hero.jpg`, `c3-triggerfish-home.jpg`, `c3-triggerfish-originals.jpg`, `c3-triggerfish-about.jpg`, `c3-triggerfish-academy.jpg`

- **Message hero** : image plein cadre d'un personnage 3D (« Aau's Song », court métrage) sans titre ni slogan ; mention « Revolting Rhymes — Oscar nominee | BAFTA » plus bas (hero, home).
- **Positionnement** : « Africa's Leading Animation Studio… Now Conquering the Rest of the World! », fondé en 1996, présence Irlande, Afrique du Sud, Royaume-Uni (about).
- **Palette** : blanc, gris clair `#DDDDDD`, bleu marine `rgb(19,62,101)` ; l'image porte la couleur (observations.json).
- **CTA principal** : aucun bouton d'action au-dessus de la ligne de flottaison ; seule la navigation (TV, Movies, Originals, Foundation, Academy, About, Contact, Jobs), « Jobs » encadré (hero).
- **Structure d'offre** : par format (TV, Movies, Originals) plus deux activités d'écosystème : *Foundation* (talents africains émergents) et *Academy* (cours en ligne « Learn from the top animation studio in Africa ») (about, academy).
- **Tarifs** : non observé (l'Academy propose « Sign up », prix non visibles sur la page vue).
- **Langues** : anglais uniquement (aucun `hreflang` ni sélecteur observé).
- **Travaux ouest-africains** : non observé ; ancrage africain affirmé mais sud-africain.

## Constats communs

1. **Le portfolio est le produit** : les trois accueils sont dominés par la vidéo ou l'image de projet (hero C1, C2, C3).
2. **Aucun prix, aucune fourchette de budget** sur les pages visitées (C1, C2, C3 : non observé).
3. **Palettes neutres (noir, blanc, gris)** : la couleur vient des images, pas de la marque (observations.json, `topColors`).
4. **Pas de parcours guidé** pour un client qui ne sait pas quel format choisir : C1 filtre par secteur, C2 et C3 listent des projets (home, work, case-studies).
5. **Afrique de l'Ouest francophone absente** : aucun projet au Sénégal ni en français d'Afrique observé ; C2 montre le Nigeria, C3 revendique l'Afrique depuis Le Cap (case-studies, about).
6. **Bilingue EN/FR chez C1 et C2, anglais seul chez C3** (sélecteurs de langue).
7. **Écosystème comme preuve** : C3 (Foundation, Academy) et C2 (Superlab, Playground) montrent de la R&D et de la transmission, pas seulement des commandes.

## Recommandations pour ATA suarl (Dakar)

1. **Occuper la place libre de l'Afrique de l'Ouest francophone** : montrer en premier des projets culturels et patrimoniaux sénégalais (dès que le portfolio réel existe), avec la mention « fabriqué à Dakar ». Aucun des trois ne l'occupe (constat 5).
2. **Afficher des fourchettes de budget** (en FCFA) et des formules d'entrée : c'est un vide chez les trois (constat 2), et le quiz de la landing V2 le fait déjà.
3. **Garder le parcours guidé « Votre trajet »** comme différenciateur : aucun concurrent n'oriente le client vers un format (constat 4).
4. **Une identité de marque colorée et locale** (palette car rapide) plutôt que le noir et blanc générique du secteur (constat 3), tant que le portfolio est encore mince.
5. **Créer une brique de transmission** (ateliers XR et IA, voir le flyer E05), sur le modèle de l'Academy de C3 et du Superlab de C2 (constat 7), pour exister avant d'avoir 200 projets à montrer.
