# E06 — Analyse concurrentielle (passe 2, ré-ancrée sur TerangaStay)

*Collecte du 13 octobre 2026. Données brutes : [`observations.json`](observations.json).*

La passe 1 (30/09/2026) avait analysé trois studios XR — Moment Factory, Superbien, Triggerfish —
parce que l'exemple du cours portait sur ATA suarl. La méthode et la discipline de preuve sont
reprises telles quelles ; le panel et les conclusions sont refaits sur le marché de TerangaStay.

## Règle de preuve

Chaque valeur citée ci-dessous a été **lue sur la page indiquée**, avec son statut HTTP consigné.
Tout le reste porte **non observé**. Quand une source tierce avance un chiffre que la page
officielle ne donne pas, le chiffre est écarté : il figure dans `observations.json` sous
`chiffres_tiers_non_retenus`, pas dans l'analyse.

C'est contraignant, et c'est le point : la question « combien me prend cette plateforme ? » est
celle que se pose Astou, et une analyse qui y répond de mémoire ne vaut rien.

## Panel

| # | Acteur | Modèle | Accès à la source |
|---|--------|--------|-------------------|
| C1 | Booking.com | OTA mondiale, commission par réservation | **403 Forbidden** sur la page d'aide aux partenaires |
| C2 | Airbnb | OTA mondiale, frais de service | 200 — barème publié |
| C3 | Jumia Travel | OTA panafricaine | **service arrêté en décembre 2019** |
| C4 | Beds24 | moteur de réservation directe, abonnement | 200 — tarif et passerelles publiés |
| C5 | Smoobu | moteur de réservation directe, abonnement | 200 — tarif publié |

Le panel mélange volontairement deux modèles économiques opposés : ceux qui prennent un
pourcentage sur chaque réservation, et ceux qui vendent un abonnement mensuel pour que
l'établissement encaisse en direct. C'est entre ces deux modèles que TerangaStay doit se situer.

---

## C1 — Booking.com

**Taux de commission : non observé.** La page d'aide aux partenaires
(`partner.booking.com/.../how-much-commission-do-i-pay`) renvoie **403 Forbidden**. Aucun taux
officiel n'a pu être lu, et la recherche n'a remonté aucune page Booking.com donnant un chiffre.

Ce n'est pas un échec de collecte, c'est un résultat : **le prix de la plus grande plateforme du panel
n'est pas public.** Les seuls chiffres disponibles viennent de guides d'éditeurs de logiciels concurrents,
qui annoncent une fourchette de 10 % à 25 %. Ils ne sont pas repris ici.

Pour une gérante, cela signifie qu'elle ne peut pas comparer avant de signer : le taux figure dans
son contrat d'hébergement et dans son extranet, pas sur le site public.

Autres dimensions : non observé.

## C2 — Airbnb

Source : `airbnb.com/help/article/1857` (200). Airbnb publie son barème avec précision, ce qui
tranche avec C1.

| Structure | Part de l'hôte | Part du voyageur |
|-----------|----------------|------------------|
| Frais partagés | « Most hosts pay a 3% service fee, but some pay more » | « Guests pay a service fee ranging from 14.1% to 16.5% of the booking subtotal » |
| Frais à la charge de l'hôte | « Most hosts pay 15.5%, remaining hosts typically pay 14%-16% » | non indiqué sur la page |

Exceptions citées : 4 % (partagé) et 16 % (hôte seul) pour le Brésil et le Mexique ; 15 % avec un
minimum de 6 USD pour les services, 20 % pour les expériences.

**Ce que 15,5 % représente ici.** Calcul, pas un tarif, à partir du catalogue réel de l'auberge
(`terangastay_chambres.csv`, 30 septembre 2026) :

| Chambre | Prix par nuit | 15,5 % | Acompte par nuit au catalogue |
|---------|---------------|--------|-------------------------------|
| Double ventilée côté jardin | 18 000 FCFA | 2 790 FCFA | 5 400 FCFA |
| Double climatisée | 28 000 FCFA | 4 340 FCFA | 8 400 FCFA |
| Case traditionnelle vue mer | 35 000 FCFA | 5 425 FCFA | 10 500 FCFA |

Sur la chambre à 28 000 FCFA, le frais « hôte seul » représente **un peu plus de la moitié de
l'acompte** que l'auberge demande au voyageur. C'est l'ordre de grandeur que le HMW appelle
« préserver la marge ».

Moyens de versement au Sénégal : non observé. Langues : non observé.

## C3 — Jumia Travel : le service régional n'existe plus

**Arrêté en décembre 2019.** Les opérations ont été transférées à Travelstart ; les sites et
applications Hotels et Flights ont été fermés. L'entreprise avait des bureaux à Lagos, Abidjan,
**Dakar**, Yaoundé, Dar es Salaam, Nairobi et Kampala. Fondée sous le nom Jovago en 2013, renommée
Jumia Travel en 2016.

Sources : [TechCabal](https://techcabal.com/2019/12/09/jumia-travel-to-be-taken-over-by-travelstart-part-of-drastic-company-changes),
[Technext](https://technext.ng/2019/12/10/jumia-shuts-down-jumia-travel-in-nigeria-closes-rwanda-operations-in-ongoing-restructuring-drive/),
[atcnews](https://atcnews.org/jumia-travel-shuts-down/).

Le successeur, `travelstart.com` (200), n'a rendu que son titre — « Search and Book Cheap
Flights ». Ses frais pour les partenaires d'hébergement : non observé.

**C'est le constat le plus utile du panel.** La couche régionale, celle qui avait un bureau à
Dakar et connaissait le marché, a disparu il y a sept ans. Ce qui reste est soit mondial, soit
européen. Aucun acteur du panel n'est implanté en Afrique de l'Ouest.

## C4 — Beds24

Sources : `beds24.com` (200) et `beds24.com/payment-gateway.html` (200).

- Prix : « **From €15.50/month** » — aucun prix par logement affiché sur la page d'accueil.
- Commission : « Pay as you go, no contract, no set up fees, **no commission**, no hidden costs ».
- Moteur direct : « **Commission free bookings from your web site** ».
- Frais de traitement : « No. You only pay a fee to your payment provider. »
- Passerelles nommées : Zettle, Google, Apple, PayPal, Stripe, Authorize.Net, AsiaPay, Agoda.
- **Aucun mobile money** : ni Wave, ni Orange Money, ni M-Pesa, ni MTN MoMo, ni Free Money.
- Pays non couverts : « We can give you the option to connect a gateway which operates in your
  country yourself. Contact us for details. »

Ce dernier point mérite d'être lu deux fois. Pour un pays sans passerelle intégrée — le Sénégal en
est un, au vu de la liste — la réponse est : faites-la brancher vous-même. Un fil du forum montre
le support orientant un utilisateur vers une passerelle personnalisée que Beds24 dit ne pas avoir
la capacité de développer. Autrement dit, une gérante devrait payer un développeur.

Langues : non observé.

## C5 — Smoobu

Source : `smoobu.com/en/prices/` (200).

| Plan | Prix affiché | Frais par réservation |
|------|--------------|-----------------------|
| Professional Flex | 29 €/mois (32,50 USD · 24,58 GBP) | « 0.9% booking fee » |
| Professional Prepaid | 35 €/mois, 31,50 € avec −10 % | « 0% booking fee » |
| Teams Pro+ | 55 €/mois, 49,50 € avec −10 % | « 0% booking fee » |

- Commission : « Our Professional Flex plan offers all the benefits of Professional Prepaid with a
  **0.9% commission fee per booking**. All our other plans are **commission-free**. »
- Facturation : « All subscriptions are billed in EUR » ; les prix en USD et GBP « are estimates
  for reference purposes only ».
- Le prix dépend du nombre d'unités : « Price based on number of units selected ».
- Moyens de paiement du moteur : **Stripe et PayPal uniquement**.
- Langues : portugais, polonais, néerlandais, italien, grec, **français**, allemand, espagnol,
  anglais. **Pas de wolof.**

Le français est donc disponible — c'est le seul acteur du panel où on l'a observé sur la page.

---

## Sept constats transversaux

**1. Le prix de la plus grande plateforme n'est pas public.** C1 renvoie 403 et aucune page officielle ne donne de
taux. Une gérante ne peut pas comparer avant de signer.

**2. Airbnb, à l'inverse, publie un barème précis** — et son option « hôte seul » à 15,5 %
représente un peu plus de la moitié de l'acompte sur la chambre à 28 000 FCFA.

**3. Deux modèles, pas un.** Commission par réservation (C1, C2) contre abonnement mensuel fixe
(C4, C5). TerangaStay doit choisir son camp explicitement, parce que les deux ne s'adressent pas à
la même contrainte : le premier coûte quand ça marche, le second coûte tout le temps.

**4. L'abonnement en euros est lui-même une barrière.** À la parité fixe du franc CFA
(1 € = 655,957 FCFA — confirmée par des sources secondaires, aucune page BCEAO obtenue) :

| | Prix affiché | Équivalent mensuel |
|---|---|---|
| Beds24, entrée de gamme | 15,50 € | ≈ 10 200 FCFA |
| Smoobu Professional Flex | 29 € | ≈ 19 000 FCFA |
| Smoobu Teams Pro+ (remisé) | 49,50 € | ≈ 32 500 FCFA |

Le plan le moins cher coûte chaque mois plus de la moitié d'une nuit en chambre ventilée, que
l'auberge ait eu des clients ou non. Le plan haut de gamme dépasse le prix d'une nuit en case vue
mer. Et la facturation est en euros : le risque de change est porté par l'établissement.

**5. Aucun acteur du panel n'intègre le mobile money sénégalais.** C4 nomme huit passerelles, aucune
de mobile money, et renvoie les pays non couverts vers un développement sur mesure. C5 ne propose
que Stripe et PayPal. Pour C1 et C2, les modalités de versement au Sénégal sont non observées — ce
qui veut dire qu'elles ne sont pas évidentes à trouver non plus.

**C'est le différenciateur de TerangaStay, et il est maintenant documenté plutôt qu'affirmé.**

**6. La couche régionale a disparu.** Jumia Travel, qui avait un bureau à Dakar, a fermé en 2019.

**7. Le français existe, le wolof nulle part.** Observé chez C5 seulement ; non observé ailleurs.

---

## Cinq recommandations pour TerangaStay

**1. Se positionner sur le paiement, pas sur le taux de commission.** C'est contre-intuitif mais
c'est ce que dit la collecte : le taux de C1 n'est même pas citable depuis une source, alors que
l'absence de Wave et d'Orange Money est documentée sur les pages officielles de C4 et C5. Un
argument vérifiable vaut mieux qu'un argument plus frappant mais non sourcé.

**2. Ne pas faire de « sans commission » le différenciateur.** C4 et C5 l'écrivent déjà, mot pour
mot. Le différenciateur réel est la combinaison : pas d'abonnement en devise étrangère, paiement
par Wave ou Orange Money, interface en français. Pris séparément, chaque élément existe ailleurs.

**3. Ne jamais facturer en euros.** Le constat 4 est un angle mort du marché : l'abonnement fixe en
devise forte punit la basse saison, exactement quand une petite structure n'a pas de trésorerie.

**4. Garder la distinction « demande ≠ réservation » comme argument, pas seulement comme scrupule.**
Aucun acteur du panel n'a été observé en train de faire cette distinction — faute de parcours de
réservation effectué, c'est un non observé, pas une preuve de leur silence. Mais c'est une
hypothèse à vérifier en S7, et si elle tient, c'est un argument de confiance.

**5. L'OTA régionale morte est l'argument pour un acteur local.** Pas « nous sommes mieux que
Booking », mais « la couche qui connaissait le marché a fermé en 2019 et personne ne l'a
remplacée ».

---

## Ce qui n'a pas été observé, et pourquoi

| Dimension | Statut | Raison |
|-----------|--------|--------|
| Taux de commission de Booking.com | non observé | page partenaire en 403 |
| Versements aux hôtes au Sénégal (C1, C2) | non observé | aucune page de modalités récupérée |
| Langues de C1, C2, C4 | non observé | non lues sur une page récupérée |
| Promesse sur la double réservation | non observé | aucune citation verbatim obtenue chez les cinq |
| Vocabulaire de statut en fin de tunnel | non observé | aucun parcours de réservation effectué |
| Inventaire sénégalais réel de chaque plateforme | non observé | hors de portée d'une collecte par page publique |
| Palettes et captures d'écran | non collectés | voir ci-dessous |

### Limites de méthode, assumées

- **Aucun navigateur.** Pas de capture, pas de `topColors` calculés comme en passe 1. Le plugin
  Playwright est activé pour ce dépôt mais pas pour la session de collecte, aucun navigateur n'est
  en cache, et l'atelier avait épinglé Playwright 1.48 pour compatibilité macOS 12 — le Chromium
  livré avec 1.64 exige macOS 13 ou plus. Les captures restent à faire dans une session navigateur.
- **Recherche indexée sur les États-Unis.** Les tarifs et la disponibilité affichés peuvent différer
  de ce que verrait une gérante depuis le Sénégal. C'est une limite réelle sur un sujet de prix.
- **Parité du franc CFA** confirmée par des sources secondaires concordantes, sans page de la BCEAO
  ni du Trésor. À confirmer avant toute réutilisation du calcul du constat 4.

### Captures à prendre

- [ ] `captures/c2-airbnb-frais.png` — le barème d'Airbnb (`airbnb.com/help/article/1857`)
- [ ] `captures/c4-beds24-prix.png` — « From €15.50/month » et « no commission »
- [ ] `captures/c4-beds24-passerelles.png` — la liste des passerelles, pour montrer l'absence de mobile money
- [ ] `captures/c5-smoobu-prix.png` — le tableau des plans et les frais par réservation
- [ ] `captures/c1-booking-403.png` — l'écran de refus de la page partenaire, c'est la preuve du constat 1
