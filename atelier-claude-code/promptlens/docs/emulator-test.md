# Emulator test — 2026-09-30 09:24

Command: `firebase emulators:start --only functions --project demo-promptlens`

```
✔  functions[us-central1-describeShotFromText]: http function initialized (http://127.0.0.1:5001/demo-promptlens/us-central1/describeShotFromText).
✔  functions[us-central1-describeShotFromImage]: http function initialized (http://127.0.0.1:5001/demo-promptlens/us-central1/describeShotFromImage).
│ ✔  All emulators ready! It is now safe to connect your app. │
```

Calls (key = temporary dummy value, restored to empty afterwards):

```
--- text sample
{"error":{"message":"The AI service did not answer. Try again in a moment.","status":"UNAVAILABLE"}}
--- text invalid (too short)
{"error":{"message":"Describe the shot in at least 3 characters.","status":"INVALID_ARGUMENT"}}
--- image sample (hero.jpg, 76 KB)
{"error":{"message":"The AI service did not answer. Try again in a moment.","status":"UNAVAILABLE"}}
--- image too big (5 MB)
{"error":{"message":"Image is 5.0 MB; the limit is 4 MB.","status":"INVALID_ARGUMENT"}}
--- image bad mime
{"error":{"message":"Invalid option: expected one of \"image/jpeg\"|\"image/png\"|\"image/webp\"","status":"INVALID_ARGUMENT"}}
```

Server log for the two AI calls: Google answered `400 API_KEY_INVALID` → the request reached Gemini (`gemini-flash-latest`) with the secret read from `functions/.secret.local`. With a real key in that file, both calls return the ShotDescription JSON.
