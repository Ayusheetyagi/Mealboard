# Family Meal Planner (Mealboard)

User describes their family in plain English once, and the app plans their weekly meal plan
based on everyone's dietary needs and preferences.

The idea is simple: describe your family, and AI turns that into a structured profile you can
edit — it's saved in your browser and used to build a meal plan. Eventually, it'll also create a
grocery list.

Why I built this

Every week, I was starting from the same blank page. Who eats what? Who can't have certain
foods? Who hates vegetables? What am I actually going to cook? And what do I need to buy? I
wanted to make sure everyone was eating healthy and in line with their preferences, but
searching for recipes manually was becoming too tedious, especially with picky eaters in the
family.

I wanted to describe all of that once and have the app remember it, instead of figuring it out
again every Sunday.

Who it's for

Anyone juggling family members with different ages, allergies, and likes, who wants meal
suggestions that already understand their family.

The tradeoffs I made

Product
- No accounts or database yet. `localStorage` instead of accounts or a database for Phase 1. The
  family profile is saved in the browser, so it stays simple and private. The tradeoff is that
  it won't sync across devices — for an MVP, that's fine: no signup, no backend, and it's up and
  running in minutes.
- I built the family profile first. Instead of trying to build the whole meal-planning
  experience at once, I wanted to test the harder part first: can the AI take a messy
  description of a family and turn it into something useful and accurate, capturing everything
  the user describes about dietary preferences and restrictions.
- The API key stays on the server. The Anthropic key is never exposed to the browser — the
  request goes through the backend instead.

AI
- Users get to check the AI's work. It's an extra step but a necessary one, to make sure
  everything is correct. The product shows users the profile it created before saving it, so
  they can fix anything it got wrong.
- Allergies aren't treated like preferences. An allergy means "never suggest this." A dislike
  means "try to avoid it." That distinction matters once the product starts planning meals.
- No formal eval yet. I manually tested different family descriptions to make sure the AI was
  correctly picking up details and distinguishing between allergies, dislikes, and preferences.

What I'd do differently

This is still an early build, so this isn't really a retrospective yet. I'll build a proper eval
loop instead of one-off manual checks — a small test set with real-world and tricky family
descriptions, including incomplete information and edge cases, and run it whenever the prompt
changes to catch regressions. I'd also track the changes users make after reviewing their
profile — those corrections are a useful signal for where the AI is getting things wrong and
what needs to improve.

The next big step is real meal planning: using the family profile to generate recipes and a
weekly plan. Around the same time, I'd probably solve cross-device syncing, before people start
building up a family profile they don't want to lose.

I'd also like to let users share recipes they've saved from Instagram or blogs and incorporate
them into the weekly plan. And this could pivot toward a nutrition angle — I'm curious about
cycle syncing for the women in a family, and building meals around that.

---

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
