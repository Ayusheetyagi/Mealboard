import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { withRetry } from "@/lib/with-retry";

const ParsedFamilyMemberSchema = z.object({
  name: z.string(),
  ageRange: z.string(),
  dietaryRestrictions: z.array(z.string()),
  dislikedFoods: z.array(z.string()),
  favoriteFoods: z.array(z.string()),
});

export const ParsedFamilyProfileSchema = z.object({
  members: z.array(ParsedFamilyMemberSchema),
  householdNotes: z.array(z.string()),
});

export type ParsedFamilyProfile = z.infer<typeof ParsedFamilyProfileSchema>;

const PARSED_FAMILY_PROFILE_JSON_SCHEMA = {
  type: "object",
  properties: {
    members: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          ageRange: { type: "string" },
          dietaryRestrictions: { type: "array", items: { type: "string" } },
          dislikedFoods: { type: "array", items: { type: "string" } },
          favoriteFoods: { type: "array", items: { type: "string" } },
        },
        required: ["name", "ageRange", "dietaryRestrictions", "dislikedFoods", "favoriteFoods"],
        additionalProperties: false,
      },
    },
    householdNotes: { type: "array", items: { type: "string" } },
  },
  required: ["members", "householdNotes"],
  additionalProperties: false,
} as const;

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You extract structured household information from casual, informal text a \
person writes about who they're cooking for. Given the user's raw text, identify each distinct \
family member mentioned and produce structured data for them.

For each person, capture:
- name: their given name if stated, otherwise a short descriptive label (e.g. "toddler", "Grandma").
- ageRange: a short free-text label — an approximate age, a life stage ("toddler", "teen", "adult"), \
or an explicit number if one is given.
- dietaryRestrictions: allergies, medical or religious restrictions, vegetarian/vegan, etc.
- dislikedFoods: foods they refuse or dislike.
- favoriteFoods: foods they love or ask for often.

If a field isn't mentioned for someone, return an empty array for it — never omit the field, \
never invent facts the text doesn't support.

Capture anything that describes the household as a whole rather than one person (e.g. "cooking for \
4", "no pork in the house", "toddler eats separately") as short strings in householdNotes.

Keep every tag short — a few words, in the user's own words where possible. Return only the \
structured data.`;

export async function parseFamilyText(rawText: string): Promise<ParsedFamilyProfile> {
  const response = await withRetry(() =>
    client.models.generateContent({
      model: "gemini-flash-latest",
      contents: rawText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: PARSED_FAMILY_PROFILE_JSON_SCHEMA,
      },
    }),
  );

  console.log("[gemini] parse-family token usage:", response.usageMetadata);

  if (response.promptFeedback?.blockReason) {
    throw new Error("The model declined to process this request.");
  }

  const text = response.text;
  if (!text) {
    throw new Error("Model did not return a response.");
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Model response was not valid JSON.");
  }

  const parsed = ParsedFamilyProfileSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Model did not return a schema-conformant response.");
  }
  return parsed.data;
}
