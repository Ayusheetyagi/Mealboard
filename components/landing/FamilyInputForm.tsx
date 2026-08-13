"use client";

import { useState } from "react";
import { PromptTextarea } from "@/components/landing/PromptTextarea";
import { MicButton } from "@/components/landing/MicButton";
import { Button } from "@/components/ui/Button";
import { useSpeechRecognition } from "@/lib/useSpeechRecognition";
import type { ParsedFamilyProfile } from "@/types/family";

interface FamilyInputFormProps {
  onParsed: (profile: ParsedFamilyProfile, rawText: string) => void;
}

export function FamilyInputForm({ onParsed }: FamilyInputFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    supported: micSupported,
    isListening,
    interimTranscript,
    error: micError,
    startListening,
    stopListening,
  } = useSpeechRecognition((finalText) => {
    setText((prev) => (prev.trim() ? `${prev.trim()} ${finalText}` : finalText));
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/parse-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
      onParsed(data.profile as ParsedFamilyProfile, text);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
      <div className="relative">
        <PromptTextarea
          value={interimTranscript ? `${text}${text.trim() ? " " : ""}${interimTranscript}` : text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell me about your family — who's eating, ages, allergies, what they love, what they refuse to touch."
          rows={8}
          disabled={isSubmitting}
          aria-label="Describe your family"
          className="pr-16"
        />
        {micSupported && (
          <div className="absolute bottom-4 right-4">
            <MicButton
              isListening={isListening}
              onClick={isListening ? stopListening : startListening}
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
      {micError && (
        <p role="alert" className="text-sm text-tomato">
          {micError}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-tomato">
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={!text.trim() || isSubmitting}>
          {isSubmitting ? "Reading…" : "Tell us about your family"}
        </Button>
      </div>
    </form>
  );
}
