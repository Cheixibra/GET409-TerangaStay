# E00 — preuves d'installation (2026-09-30 07:12)

```
$ claude --version
2.1.285 (Claude Code)
$ node --version
v20.19.4
$ git --version
git version 2.37.1 (Apple Git-137.1)
$ npm view @anthropic-ai/claude-code version
2.1.285
$ [ -n "$ANTHROPIC_API_KEY" ] && echo "CLE API PRESENTE" || echo "pas de cle API"
pas de cle API
$ claude auth status
{
  "loggedIn": true,
  "authMethod": "claude.ai",
  "apiProvider": "firstParty",
  "analyticsDisabled": false,
  "subscriptionType": "pro"
}
```

Constats :
- Claude Code 2.1.285 ≥ 2.1.280 (à jour, identique à la dernière version npm).
- Aucune clé `ANTHROPIC_API_KEY` dans l'environnement : la facturation passe par l'abonnement.
- `authMethod: claude.ai` et `subscriptionType: pro` : connecté au plan Pro.
- Environnement : macOS (et non Windows comme dans l'atelier) ; Claude Code tourne via l'extension VS Code.
- Le dossier `~/claude-lab` existe et contient les exercices.

Les écrans interactifs (`/status`, `/usage`, `/context`) ne peuvent être capturés que dans une session interactive : à faire toi-même si ton formateur demande les captures.
