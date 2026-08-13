import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import type { FamilyProfile } from "@/types/family";
import { withRetry } from "@/lib/with-retry";

const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

const RecipeSchema = z.object({
  id: z.string(),
  day: z.string(),
  mealType: z.enum(MEAL_TYPES),
  title: z.string(),
  description: z.string(),
  instructions: z.array(z.string()),
  prepMinutes: z.number(),
  servings: z.number(),
  tags: z.array(z.string()),
  sourceUrl: z.string().optional(),
});

const GroceryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.string(),
  category: z.string(),
});

export const WeeklyPlanSchema = z.object({
  recipes: z.array(RecipeSchema),
  groceryList: z.array(GroceryItemSchema),
});

export type WeeklyRecipe = z.infer<typeof RecipeSchema>;
export type WeeklyGroceryItem = z.infer<typeof GroceryItemSchema>;
export type WeeklyPlan = z.infer<typeof WeeklyPlanSchema>;

const WEEKLY_PLAN_JSON_SCHEMA = {
  type: "object",
  properties: {
    recipes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          day: { type: "string" },
          mealType: { type: "string", enum: ["breakfast", "lunch", "dinner"] },
          title: { type: "string" },
          description: { type: "string" },
          instructions: { type: "array", items: { type: "string" } },
          prepMinutes: { type: "number" },
          servings: { type: "number" },
          tags: { type: "array", items: { type: "string" } },
          sourceUrl: { type: "string" },
        },
        required: [
          "id",
          "day",
          "mealType",
          "title",
          "description",
          "instructions",
          "prepMinutes",
          "servings",
          "tags",
        ],
        additionalProperties: false,
      },
    },
    groceryList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          quantity: { type: "string" },
          category: { type: "string" },
        },
        required: ["id", "name", "quantity", "category"],
        additionalProperties: false,
      },
    },
  },
  required: ["recipes", "groceryList"],
  additionalProperties: false,
} as const;

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function buildPrompt(profile: FamilyProfile): string {
  const members = profile.members
    .map((m) => {
      const parts = [`${m.name} (${m.ageRange || "age not given"})`];
      if (m.dietaryRestrictions.length) parts.push(`restrictions: ${m.dietaryRestrictions.join(", ")}`);
      if (m.dislikedFoods.length) parts.push(`won't eat: ${m.dislikedFoods.join(", ")}`);
      if (m.favoriteFoods.length) parts.push(`loves: ${m.favoriteFoods.join(", ")}`);
      return `- ${parts.join("; ")}`;
    })
    .join("\n");
  const notes = profile.householdNotes.length
    ? `\nHousehold notes:\n${profile.householdNotes.map((n) => `- ${n}`).join("\n")}`
    : "";

  return `Plan a full week of meals (Monday through Sunday) for this family, drawing on real, \
well-known recipes from your own knowledge. For each day, plan breakfast, lunch, and dinner — 21 \
meals total. Breakfasts and lunches should be quick and simple; dinners can be more involved. Every \
meal must work for every family member's restrictions; use their favorites and dislikes as soft \
preferences, not hard constraints. Only include a sourceUrl if you're confident it's a real, correct \
link — omit it rather than guessing.

Family members:
${members}${notes}

Also produce a consolidated grocery list covering all 21 meals' ingredients, de-duplicated across \
the week and grouped into short category names like "Produce", "Dairy", "Protein", "Pantry".

Give each recipe a short id (e.g. "mon-breakfast") and each grocery item a short unique id. Keep \
descriptions to one short sentence, plain and specific — no marketing language. For each recipe, also \
give clear step-by-step cooking instructions as an array of short, actionable steps (e.g. "Dice the \
onion and garlic", "Heat oil in a large pan over medium heat") — enough that someone could actually \
follow along and cook it, typically 4-8 steps depending on complexity.`;
}

export async function generateWeeklyPlan(profile: FamilyProfile): Promise<WeeklyPlan> {
  const response = await withRetry(() =>
    client.models.generateContent({
      model: "gemini-flash-latest",
      contents: buildPrompt(profile),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: WEEKLY_PLAN_JSON_SCHEMA,
      },
    }),
  );

  console.log("[meal-plan] token usage:", response.usageMetadata);

  if (response.promptFeedback?.blockReason) {
    throw new Error("The model declined to generate a plan for this request.");
  }
  const structuredText = response.text;
  if (!structuredText) {
    throw new Error("Model did not return a plan.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(structuredText);
  } catch {
    throw new Error("Model response was not valid JSON.");
  }

  const parsed = WeeklyPlanSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Model response did not match the expected plan shape.");
  }
  return parsed.data;
}
