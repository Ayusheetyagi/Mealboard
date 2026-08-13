import { NextRequest, NextResponse } from "next/server";
import { parseFamilyText } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const text = (body as { text?: unknown } | null)?.text;
  if (typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Tell us a bit about your family first." },
      { status: 400 },
    );
  }
  if (text.length > 4000) {
    return NextResponse.json(
      { error: "That's a lot of text — try trimming it a bit." },
      { status: 400 },
    );
  }

  try {
    const profile = await parseFamilyText(text);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("[parse-family] failed:", err);
    return NextResponse.json(
      { error: "We couldn't process that just now. Please try again." },
      { status: 502 },
    );
  }
}
