# Audit de sécurité — sous-agent `terangastay-reviewer` (E14, passe 2)

- **Date** : 13 octobre 2026
- **Agent** : `elegant-builds-studio/.claude/agents/terangastay-reviewer.md` (commit `216b20b`)
- **Cible** : `elegant-builds-studio`, branche `chore/claude-code-setup`
- **Lancement** : depuis la session principale, après rechargement de la session — l'agent
  n'existait pas dans la session qui l'avait écrit
- **Consigne donnée** : passer les six contrôles, signaler sévérité, `fichier:ligne`, raison et
  correctif ; ne lire aucun fichier secret ; ne rien modifier. **Aucun indice** sur ce qu'il
  devait trouver.
- **Modifications** : aucune — outils `Read, Grep, Glob` uniquement

Le rapport ci-dessous est la sortie de l'agent, **non retouchée**. Les vérifications de la session
principale sont dans une section séparée, à la fin.

---

## Rapport de l'agent (verbatim)

TerangaStay security review. Nothing was edited, and I did not read .env, .env.local or any other secret file. There are no Critical or High findings. Two Medium, three Low, one Info.

**1. Secret boundary: no finding, with one gap**
- `DIFY_API_KEY` is read only at `src/lib/ask-dify.functions.ts:46`, inside the `createServerFn` handler. The Authorization header is built at line 58, also inside the handler.
- A grep of `src/` found no `VITE_*` use and no `import.meta.env`.
- `.output/` does not exist, so I could not grep the built bundle for the key or an Authorization header. Please build and grep it before release.
- The source-level check is clean.

**2. Server-function inputs**
- **Medium. `src/lib/ask-dify.functions.ts:44`, `user: "terangastay"` at line 59.** The `inputValidator` is Zod with `trim().min(1).max(4000)`, and the text reaches Dify only as `inputs.query`. That part is fine. Two weaknesses remain:
  - The endpoint is public with no rate limit or abuse control. Anyone can POST to the server function and use up the Dify and Gemini quota. The error text "Quota du modèle IA épuisé" shows this quota already matters.
  - The `user` field is a constant, so Dify cannot tell callers apart.
  - Fix: add Cloudflare rate limiting or a WAF rule on the server-function route, or a Turnstile token in the validator. Optionally derive `user` from a hashed client IP.
- **Info.** `src/lib/teranga-agent.ts:6` truncates with `.slice(0, 4000)`, which is consistent with the server cap.

**3. Error surfaces**
- **Medium. `src/lib/ask-dify.functions.ts:20` and `:65`.** `extractErrorMessage` never returns the key or headers, but its non-JSON branch returns the first 150 characters of the raw upstream body. This reaches the client in `error: Dify ${res.status} : ${bodyMessage}`, and `src/components/agent-search.tsx:86` shows it on screen.
  - The JSON branch also forwards arbitrary upstream `message`, `error` or `code` strings without a length cap.
  - Line 85 likewise forwards 150 characters of `json.data.error`.
  - Upstream text can leak internal details such as workflow node names, model errors or an upstream URL.
  - Fix: return only fixed, mapped strings to the client, for example 401/403 gives "Service mal configuré", 429 gives "Trop de demandes", and everything else gives "Service temporairement indisponible". Keep the detail in server logs only.
- **Low. `src/lib/ask-dify.functions.ts:49`.** The client receives "Clé API absente du serveur". This confirms the deployment state and the existence of an API key. Return the generic message and keep the detail in `console.error`.
- **Low. Lines 64, 87 and 98.** `console.error` logs the upstream message (up to 150 characters, or a JSON field). It does not log the key or the user's `question`, but upstream errors can echo the prompt. Keep the log, but consider truncating it or logging only the status code.
- `src/server.ts:31` and `:54`, `src/start.ts:12` and `src/routes/__root.tsx:40` call `console.error(error)` on whole error objects. These are Lovable template code. I did not trace what the Lovable error pipeline does with them, so I can't say whether it exposes stack traces to the client. `src/lib/error-page.ts` is the file to check.

**4. Honesty invariants: no finding on the three main points, with two notes**
- **Reservation source.** The `reservation` object comes only from `parseReservation` (lines 33-41). That function Zod-validates `outputs.reservation`, the VERIF_DISPO output, and falls back to null. It never uses `outputs.text`. `holdsRoom` in `src/lib/pending-requests.ts:17` additionally requires `statut === "DISPONIBLE"` and a non-empty `chambre`.
- **Status strings.** In `src/components/agent-search.tsx:9-11` the strings are "Conflit… ne pas confirmer", "Informations manquantes" and "En attente de validation". None claims confirmed, reserved or guaranteed.
- **Reservation dialog.** `src/components/reservation-dialog.tsx:120-125` states plainly that the text "n'est pas une réservation".
- **Low (honesty). Client-side price arithmetic.**
  - Locations: `src/routes/hebergements.tsx:84` and `:118`, and `src/components/reservation-dialog.tsx:233`, all compute `stay.price * nights`.
  - The invariant says no price or total is computed client-side. These are labelled "estimation" and "à confirmer", and the data is demo data, so the risk is moderate.
  - Line 84 labels it "Total pour N nuits" with no qualifier. Rename it to "Estimation" for consistency with line 118, or take the total from a server or catalog value.
- **Note.** `src/components/agent-search.tsx:90` renders `answer`, which is the model's prose, and `getBanner` (lines 7-13) infers the banner from keywords in that prose. This does not set the `reservation` object, so the invariant holds. But the banner can disagree with the validated `reservation.statut`. The model could say "DEMANDE REÇUE" while `statut` is CONFLIT, and then no conflict banner shows. Derive the banner from `reservation.statut` first, and use prose as a fallback only.
- **Low. `src/routes/index.tsx:27`.** The hero headline says "Des séjours réservés en direct". This is marketing copy rather than a status string, but it sits close to the "reserved" claim. Consider "à réserver en direct".

**5. Personal data: no finding, with a note**
- `src/lib/pending-requests.ts` holds only room, type, nights, time and a flag, in React state in `src/components/agent-search.tsx:28`. A grep found no `localStorage`, `sessionStorage`, `indexedDB` or `document.cookie` anywhere in `src`.
- The first name and message in the reservation dialog stay in draft state and go only into text the user copies. `src/routes/contact.tsx` uses `mailto` with no fetch.
- Traveller text pasted into the assistant does leave the site for Dify Cloud and Gemini. `src/routes/confidentialite.tsx:34` discloses this and warns users not to paste names or numbers. That is acceptable. The only protection is the UI hint in `src/components/agent-search.tsx:78`, so optionally add a server-side redaction of phone-like patterns before the Dify call.
- **Low. `src/data/stays.ts:31-36`.** Coordinates have 4 decimals (about 11 m), for example `[14.6047, -17.1489]`. The comment says "town-level, never the exact address", but 4 decimals is point-level precision. If these are the actual lodge positions, they are effectively street-level. Round to 2 decimals (about 1 km) or confirm they are locality centroids.

**6. Deploy surface**
- **`.gitignore`: no finding.** It ignores `.output`, `.env`, `.env.*` (keeping `!.env.example`), `.dev.vars*`, `*.local`, `.wrangler/` and `*serviceAccount*.json`. `.claude/settings.json` denies Read and Edit on `.env*` and `.dev.vars`.
- **Medium (documentation and config). `.env.example` does not exist**, although the commit message and `CLAUDE.md` say `DIFY_API_KEY` is documented. No `wrangler.toml`, `wrangler.jsonc` or `package.json` mention of wrangler or secrets was found. I cannot verify that the secret is set with `wrangler secret put` or the Lovable secret. A `process.env` read in Workers also needs the `nodejs_compat` flag or an env binding, and I found no Cloudflare config. Add `.env.example` with an empty `DIFY_API_KEY=` and a deployment note covering `wrangler secret put DIFY_API_KEY`, and confirm the Cloudflare config.
- A grep for `DIFY` and key-like patterns outside `src/` and `node_modules` found only docs and comments (`.gitignore`, `CLAUDE.md`, the reviewer agent definition), and no key value. I did not scan git history.

**Summary**
- Medium: unauthenticated and unthrottled server function; upstream text forwarded to the client; missing `.env.example` and Cloudflare secret config.
- Low: "Clé API absente" leak; client-side `price * nights`; banner derived from model prose; 4-decimal coordinates; hero copy wording.

---

## Vérification par la session principale

Un rapport d'agent est une sortie de modèle : chaque affirmation vérifiable a été contrôlée.

| Constat de l'agent | Verdict | Vérification |
|--------------------|---------|--------------|
| Clé lue seulement ligne 46, en-tête ligne 58 | **confirmé** | lignes relues |
| `user: "terangastay"` constant, ligne 59 | **confirmé** | ligne relue |
| Corps amont brut renvoyé au client, ligne 65 | **confirmé** | `error: \`Dify ${res.status} : ${bodyMessage…}\`` |
| « Clé API absente du serveur », ligne 49 | **confirmé** | ligne relue |
| « Total pour N nuits » sans qualificatif, `hebergements.tsx:84` | **confirmé** | contre « Estimation pour » ligne 118 |
| Bandeau déduit de la prose (`getBanner`) | **confirmé** | trouvé **sans indice** ; c'était déjà le défaut n°1 de l'audit initial de la session |
| Aucune config Cloudflare dans le dépôt | **confirmé, nuancé** | aucun `wrangler.*` ; mais le preset Nitro génère `.output/server/wrangler.json` au build, et le déploiement fonctionne (module F du journal L4) |
| Ligne 20 pour la branche non-JSON | **approximatif** | la ligne 20 est une accolade ; la branche est quelques lignes plus haut |
| **« `.env.example` does not exist »** | **faux** | le fichier existe et est suivi par git (commit `9f6f097`) — voir ci-dessous |

### Le faux positif révèle un vrai défaut — dans la passe 2 elle-même

L'agent n'a pas pu lire `.env.example`, et en a conclu qu'il n'existait pas. La cause : la règle
`deny` posée en E08, `Read(./.env.*)`, couvre aussi `.env.example`. La session principale s'est
heurtée au même mur en vérifiant : un simple `ls .env.example` a été bloqué.

Le fichier même qui documente la clé est donc invisible pour Claude. C'est un compromis à
trancher, pas une erreur à corriger en silence :

- **garder la règle large** — fermée par défaut : un nouveau `.env.staging` serait protégé sans
  y penser ; le coût est que Claude ne lit pas `.env.example`, ce qu'il faut alors écrire dans
  le `CLAUDE.md` et dans la définition de l'agent pour éviter ce faux positif ;
- **énumérer les fichiers** (`.env`, `.env.local`, `.env.*.local`, `.env.production`…) — Claude
  lit `.env.example`, mais toute variante oubliée n'est plus protégée.

Une règle `allow` ne suffirait pas : dans Claude Code, `deny` l'emporte sur `allow`.

**Décision (13/10/2026)** : la règle large est gardée, et documentée dans le `CLAUDE.md` et
dans la définition de l'agent — commit `7bff1c7` du dépôt applicatif.

### Constats réels, non corrigés à ce stade

Les corrections relèvent du produit, sur un dépôt synchronisé avec Lovable : elles sont laissées
à une décision explicite. Par ordre de priorité proposé :

1. bandeau déduit de `reservation.statut`, la prose en repli seulement (`agent-search.tsx`)
2. messages d'erreur fixes côté client, détail amont gardé dans les journaux serveur
3. « Total pour » → « Estimation pour » (`hebergements.tsx:84`)
4. limitation de débit sur la fonction serveur (quota Dify / Gemini exposé)
5. coordonnées arrondies à la localité (`stays.ts`) — le commentaire promet la ville, quatre
   décimales donnent environ 11 m
