---
name: setup
description: Interview the owner (max 10 questions, one at a time) to fill SOUL.md with identity, organisations, ranked priorities, communication style, verbatim writing samples, voice rules and exclusions.
disable-model-invocation: true
---

# /setup — fill SOUL.md

1. Read `SOUL.md`. If it is already filled, show a 5-line summary and ask what to update instead of starting over.
2. Ask **one question at a time**, in French, maximum 10 questions in total, in this order:
   1. Ton rôle principal aujourd'hui, en une phrase ?
   2. Les organisations avec lesquelles tu travailles (et ton rôle dans chacune) ?
   3. Tes 5 priorités du moment, classées de 1 à 5 ?
   4. Longueur préférée des réponses et des textes (court, moyen, détaillé) ?
   5. Registre (tutoiement/vouvoiement, formel/familier) selon le public ?
   6. Profondeur technique attendue ?
   7–9. Colle 3 vraies phrases que tu as écrites (une par question).
   10. Ce que tu ne veux jamais voir dans mes productions (mots, tournures, formats) ?
3. Quote writing samples **verbatim**. Add nothing the owner did not say; leave a section as "non renseigné" rather than guess.
4. Write `SOUL.md` following its template, keep it **under 2 KB**, then report its size in bytes (`wc -c SOUL.md`).
5. Append to `vault/log.md`: `YYYY-MM-DD HH:MM · setup · SOUL.md written (N bytes)`.
