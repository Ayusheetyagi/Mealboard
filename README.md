# Family Meal Planner

A parent describes their family in plain language once; the app remembers
everyone's dietary restrictions and preferences and (eventually) plans the
week's meals and a grocery list. Built with Next.js 14 (App Router),
TypeScript, and Tailwind CSS.

This is **Phase 1**: family profile capture, AI parsing into structured JSON,
an editable summary card, and localStorage persistence. The "Plan my week"
screen is stubbed with dummy data — real recipe generation via Claude +
web search comes in a later phase.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Add your Anthropic API key to `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — lint

## Notes

- No accounts, no database — the family profile lives entirely in the
  browser's `localStorage` (key `fmp:family-profile:v1`).
- The Anthropic API key is read server-side only (`lib/anthropic.ts`, called
  from `app/api/parse-family/route.ts`) and never reaches the client.
- Deploying to Vercel: set `ANTHROPIC_API_KEY` in the project's environment
  variables.
