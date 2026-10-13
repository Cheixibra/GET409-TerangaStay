# TerangaStay — project memory

## What this is

A direct-booking platform for small independent Senegalese accommodation: auberges,
campements and maisons d'hôtes, mostly outside Dakar. Travellers send a request straight
to the establishment instead of going through an international platform that takes a
commission.

The manager's assistant is the core feature: she pastes a traveller's message (WhatsApp,
Facebook, email), a Dify agent extracts the request, a deterministic code node checks the
calendar room by room and night by night, and the app shows her a fiche plus a message she
can forward.

**The agent prepares, the manager decides.** Nothing in this product confirms a booking.

Guiding question (HMW): help small Senegalese accommodation centralise and confirm their
direct bookings with a reliable calendar, to avoid double bookings and protect their margin.

## Stack & versions

- TanStack Start 1.168 + TanStack Router 1.170 — file-based routing, server functions
- React 19.2, TypeScript 5.8 (strict), Vite 8.1
- Tailwind CSS 4.2 — design tokens in `src/styles.css`, no config file
- Zod 3.25 for every boundary; Leaflet 1.9 for the map; Radix + shadcn/ui in `src/components/ui/`
- Bun for installs (`bun.lock` is committed). `bunfig.toml` holds a 24h supply-chain guard —
  ask before adding a package to `minimumReleaseAgeExcludes`.
- Hosted twice: Lovable (`teranga-stay.lovable.app`) and Cloudflare Workers
  (`terangastay.sdiengdk.workers.dev`), from the same repo.

## Commands

```bash
bun dev                                   # dev server
npm run build                             # production build -> .output/
npx tsc --noEmit                          # the real type gate; currently passes
npm run format                            # prettier --write .
npm run lint                              # see the warning below
npx wrangler@4 deploy --name terangastay  # Cloudflare; ask before deploying
```

`npm run lint` is currently **not** a usable gate: it reports ~214 errors that are all pure
Prettier formatting, plus 6 `react-refresh` warnings inside generated shadcn/ui files. Run
`npm run format` to clear the formatting noise, and treat `npx tsc --noEmit` as the gate.
Do not fold a repo-wide `format` sweep into a feature commit.

## Folder structure

```
src/
  routes/          file-based routes — see src/routes/README.md before adding one
    __root.tsx     app shell (nav + footer live in SiteShell)
    index.tsx  hebergements.tsx  contact.tsx  confidentialite.tsx
  components/
    agent-search.tsx      the manager's assistant: calls the agent, renders banners, I1 list
    reservation-dialog.tsx honest request flow: prepares a message to copy, sends nothing
    site-shell.tsx  stays-map.tsx  button.tsx
    ui/             generated shadcn/ui — do not hand-edit
  lib/
    ask-dify.functions.ts  server function holding DIFY_API_KEY; Zod schemas
    teranga-agent.ts       askTerangaStayAgent — the only entry point to the agent
    pending-requests.ts    I1 conflict detection, in-tab memory only
  data/stays.ts    typed demo accommodation data, with per-item `updated` dates
  styles.css       design tokens (oklch) — the single source of colour truth
  start.ts         server entry: CSRF + error middleware
  server.ts        Cloudflare/Nitro entry
```

`src/routeTree.gen.ts` is generated — never edit it.

## Conventions

- Code, comments, commit messages and this file in English. **UI copy in French.**
- Every Dify call goes through `askTerangaStayAgent`; nothing else talks to the agent.
- Colours only via the tokens in `styles.css`. Never a raw hex in a component.
  `oklch` is the required format. Terre cuite `--accent` fails WCAG AA on white for normal
  text (4.18:1) — use `--accent-strong` for small text, links and filled buttons.
- Every server function validates its input with Zod, with a length cap.
- Prices and deposits are copied from the catalogue. Never computed, summed or multiplied.
- Three statuses, three banners, no fourth: Demande reçue / Conflit / Informations manquantes.
- Architecture invariants live in `AGENTS.md` (SiteShell, the single data module, the
  `askTerangaStayAgent` boundary). Read it; do not copy its rules here — Lovable rewrites
  that file and the two would drift.

## Domain terms

- **chambre** — a numbered room, C1 to C14, belonging to a **type de chambre**
- **nuit / séjour** — a stay covers the nights from arrival to the night before departure
  (departure on the 22nd means the last night is the 21st)
- **demande** — a traveller's request. Never a booking.
- **acompte** — 30% deposit, precomputed per night in the catalogue, paid by Wave or Orange Money
- **DISPONIBLE / CONFLIT / INSUFFISANT** — the agent's three outcomes
- **VERIF_DISPO** — the Dify code node (Python, no LLM) that decides availability
- **I1** — the alert raised when two pending requests want the same room on the same night
- **haute / basse saison**, amounts in **FCFA**

## Never

- Never present a request as confirmed, reserved or guaranteed. Those words may only
  describe what the manager, a human, will do.
- Never let a model compute a price, a total or an availability.
- Never read `DIFY_API_KEY` outside a `createServerFn` handler, and never put it in a
  `VITE_*` variable — anything `VITE_*` is inlined into the client bundle.
- Never return an API key, a request header or a stack trace to the client in an error.
- Never invent a phone number, a price, a payment link or an availability.
- Never persist a traveller's name, phone number or message. `pending-requests.ts` is
  in-tab memory on purpose.
- Never rewrite published history — no force-push, rebase or amend on pushed commits.
  Lovable syncs this branch and the user would lose their project history.
- Never deploy without asking.

## Secret files are unreadable on purpose

`.claude/settings.json` denies Read and Edit on `./.env` and `./.env.*`. The glob also covers
`.env.example`, so Claude cannot open it — **the file exists and is tracked**; check with
`git ls-files`, never conclude from a blocked read that it is missing. This is a deliberate
fail-closed choice: a new variant such as `.env.staging` is protected without anyone thinking
of it. Enumerating files instead would expose any variant someone forgets. An `allow` rule
cannot carve out an exception — `deny` always wins. What `.env.example` documents is restated
here: `DIFY_API_KEY`, server-side only, never a `VITE_*` variable.
