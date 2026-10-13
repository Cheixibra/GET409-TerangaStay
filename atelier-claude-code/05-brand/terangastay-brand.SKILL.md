---
name: terangastay-brand
description: Apply TerangaStay's brand identity (palette, typography, voice, vocabulary, honesty rules, sign-offs) to every output of the conversation — emails, posts, HTML pages, documents, UI copy.
disable-model-invocation: true
---

# TerangaStay — brand identity

When this skill is invoked, reply with exactly one line:
"Identité TerangaStay active." — then apply everything below to every output
for the rest of the conversation (emails, social posts, HTML pages, documents, UI copy).

> Pass 2 of the Claude Code workshop (TerangaStay re-anchoring). Unlike the pass-1 skill
> `ata-brand.SKILL.md`, almost nothing here was proposed in a workshop: every value is
> harvested from production code or from the published project docs. The few exceptions
> carry (proposé) and must be validated before use.

## Sources

Every value in this file comes from one of these files. A value that cannot be traced
to this table must carry (proposé).

| What | Source of truth |
|------|-----------------|
| Palette, status colours, fonts | `elegant-builds-studio/src/styles.css` (`:root`, `@theme inline`) |
| Tagline, UI copy | `elegant-builds-studio/src/routes/index.tsx` (hero) |
| Zones, room types, prices, catalogue dates | `elegant-builds-studio/src/data/stays.ts` |
| Room numbers, per-night deposits | `GET409-TerangaStay/docs/dify-s5/terangastay_chambres.csv` |
| Honesty rules, banners, guardrails | `GET409-TerangaStay/docs/s5/note-ethique-s6.md` |
| Positioning, what we must NOT promise | `GET409-TerangaStay/docs/hmw-definitif.md` |
| Photographs | `elegant-builds-studio/src/assets/*.jpg` (6 real files) |

## Identity
- TerangaStay — direct-booking requests for small independent Senegalese guesthouses
  (auberges, campements, maisons d'hôtes), without international-platform commissions
- Priority persona: Astou Sarr, manager of an independent 14-room auberge in Toubab Dialaw
- Our question (HMW): centraliser et confirmer les réservations directes avec un calendrier
  fiable, pour éviter les doubles réservations et préserver la marge
- Tagline (harvested from the live hero):
  « Des séjours réservés en direct, chez ceux qui vous accueillent. »
- The agent prepares, the manager decides. Always, in every piece of copy.

## Palette — harvested from `:root`, oklch is the source of truth

Never invent a colour. Copy these values verbatim. In web pages, use the oklch column.
The sRGB column exists only for the contexts listed under "sRGB exception"; it is derived
from the oklch values, not a second source of truth.

| Role | Name | oklch | sRGB (derived) |
|------|------|-------|----------------|
| Background | Sable | `oklch(0.978 0.011 85)` | `#fbf7f0` |
| Text | Encre | `oklch(0.24 0.03 225)` | `#0e222a` |
| Surface | Carte | `oklch(1 0 0)` | `#ffffff` |
| Accent | Terre cuite | `oklch(0.6 0.13 42)` | `#bf623d` |
| Accent (hover, links) | Terre cuite foncée | `oklch(0.53 0.13 40)` | `#a84d2b` |
| Primary | Teal | `oklch(0.43 0.075 205)` | `#005b63` |
| Primary (strong) | Teal foncé | `oklch(0.36 0.07 210)` | `#004751` |
| Secondary surface | Sable chaud | `oklch(0.948 0.02 80)` | `#f5eddf` |
| Muted surface | Sable sourd | `oklch(0.94 0.015 80)` | `#f0eae0` |
| Muted text | Encre atténuée | `oklch(0.48 0.025 225)` | `#4f6168` |
| Border | Sable bordure | `oklch(0.88 0.02 80)` | `#ded6c9` |
| Result surface | Sable clair | `oklch(0.975 0.01 85)` | `#faf6ef` |
| Footer | Encre profonde | `oklch(0.23 0.035 225)` | `#072029` |
| On dark surfaces | Blanc chaud | `oklch(0.99 0.003 96)` | `#fcfcf9` |

### Status colours — they carry the honesty rules, do not repurpose them

| Status | Meaning (never widen it) | Text on background (oklch) | sRGB (derived) |
|--------|--------------------------|----------------------------|----------------|
| Demande reçue | received, awaiting the manager's validation | `oklch(0.45 0.1 85)` on `oklch(0.96 0.08 95)` | `#6e5000` on `#fff2b5` |
| Conflit | the room is not free for every night | `oklch(0.577 0.245 27.325)` on `oklch(0.94 0.04 25)` | `#e7000b` on `#ffe2de` |
| Informations manquantes | incomplete request; nothing was guessed | `oklch(0.5 0.15 50)` on `oklch(0.94 0.05 60)` | `#a34100` on `#ffe4ca` |
| Données de démonstration | demo data, to confirm before publication | `oklch(0.37 0.07 62)` on `oklch(0.95 0.04 80)` | `#5a3613` on `#fdecd1` |

Rules:
- There is no green and no "confirmé" colour, by design. Nothing in this product is confirmed
  by software. Do not add one.
- Terre cuite is for one call to action per piece, and for eyebrows. Not for decoration.
- Encre on Sable or Carte for body copy (16.4:1).
- **Terre cuite `oklch(0.6 0.13 42)` reaches only 4.18:1 on white — it fails WCAG AA for normal
  text.** Use it for large display text, borders and decoration only. For small text, links and
  filled buttons use Terre cuite foncée `oklch(0.53 0.13 40)`: 5.58:1 on Carte, and Blanc chaud
  on it reaches 5.43:1.
- Text on Teal: Blanc chaud (7.63:1).
- Measured ratios, do not re-estimate them: Encre atténuée on Carte 6.48:1, Terre cuite foncée
  on Sable 5.23:1. Any new pair must be measured before use.
- Soft, wide shadows (`0 18px 50px` at ~7% Encre), never hard offset shadows.
- Dark theme: the `.dark` block in production is leftover shadcn boilerplate — its accent is a
  blue-grey, not Terre cuite — and nothing in the app ever applies it. Do not harvest it.
  Any dark variant must be derived from the values above and marked (proposé).

### sRGB exception

Two contexts cannot use oklch and must use the derived sRGB column instead:
- **HTML emails** — oklch is unsupported in most email clients
- **Offline workshop pages** — only where a reviewer may open the file in an old browser

Everywhere else, oklch. A file using sRGB must say why in a comment, as the email template does.
The conversion is oklch → OKLab → linear sRGB → gamma-encoded sRGB; re-derive it rather than
eyeballing a hex, because an estimated value is an invented one.

## Typography — harvested from `@theme inline`
- Display: Fraunces (variable serif), weight 500, `font-variation-settings: "opsz" 96`,
  tight tracking (-0.015em). Eyebrows are Fraunces **italic** in Terre cuite.
  Fallback: `ui-serif, Georgia, serif`
- Body: Instrument Sans. Fallback: `ui-sans-serif, sans-serif`
- No uppercase display headlines. Sentence case, with a balanced text wrap.
- Emails and offline pages: fallback stacks only (no remote font files)

## Voice
- Posé, concret, honnête — precise, never salesy
- French by default; vouvoiement with travellers and with managers
- Short sentences. Concrete verbs. One idea per paragraph.
- Say what the product does and what it does not do. The limits are part of the pitch.
- Name the person who decides: « c'est vous qui confirmez », « la gérante décide »

## Words

Use:
- réserver en direct, demande, demande reçue, acompte, nuit, séjour, chambre, calendrier,
  la gérante confirme, sans commission, en attente de validation, à confirmer,
  FCFA, Wave, Orange Money, Sénégal

Avoid (banned):
- révolutionnaire, disruptif, leader, n°1, incroyable, unique en son genre, synergie,
  game-changer, clé en main, booster, solution innovante
  — banned **about ourselves**. Stating a competitor's market position as an observed fact is
  not puffery; prefer a neutral phrase anyway, so a grep over our own copy stays clean.
- **« confirmée », « réservée », « réservation confirmée », « garanti », « disponibilité garantie »,
  « place garantie »** — as a status produced by the product. A request is never a booking.
  The words may appear only to say that the manager, a human, will confirm — or in an unrelated
  sense, such as a figure confirmed by a source. What is banned is a *booking status* presented
  as settled by software.
- any invented price, phone number, payment link, availability, client name, figure, award
  or testimonial
- any computed total: prices and deposits are copied from the catalogue, never summed or
  multiplied in generated copy
- promises the project explicitly rules out (`hmw-definitif.md`, "Non-objectifs"):
  automatic synchronisation with every platform, the removal of all commissions,
  any certification of accommodation quality, any guarantee of an international payment

## Formatting
- Emojis: none in emails to managers or travellers; at most 1 in social posts
- Hashtags: max 3, always including #Sénégal
- Dates: « 12 octobre 2026 » style, 24h times
- Amounts: « 28 000 FCFA » — thousands separated by a space, currency after, copied from the
  catalogue. Always state the catalogue date when quoting a price.
- Status words always keep their banner wording: Demande reçue / Conflit / Informations manquantes

## Sign-offs (pick one, verbatim)
- « Au plaisir de vous accueillir en direct. »
- « À très vite, depuis le Sénégal. »
- « L'équipe TerangaStay »

A message written for a manager to forward to a traveller is signed by the auberge,
never by TerangaStay.

## Self-check before sending any output
1. No banned word
2. Palette respected (oklch, or the derived sRGB column in one of the two listed exceptions),
   and every text/background pair reaches 4.5:1 — measured, not estimated
3. Ends with one sign-off from the list
4. No invented facts — no price, number, link or availability that is not in a source file
5. No status presented as confirmed, reserved or guaranteed; the manager is named as the
   one who decides, and any price carries its catalogue date
