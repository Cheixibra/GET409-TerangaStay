# .claude/ralph-brief.md — PromptLens polish
Each round:
1. Review the current UI with the frontend-design skill: layout, typography, spacing, states, mobile.
2. List issues, rank them by impact/effort, fix the top 3.
3. Run `npm run build`; fix any error.
4. Append a dated entry to docs/decisions.md ("Ralph round n: what changed").

Quality bar: looks like a real product, not a demo. Clear hierarchy, consistent spacing, works at 360 px and on desktop, loading / empty / error states everywhere.
Add if missing: header with the app name and today's date; per-production progress; filter by shot size; card layout for entries.

Output <promise>POLISHED</promise> only when every point of the quality bar is genuinely met and the build passes.
Never touch functions/, .env*, or Firebase rules.
