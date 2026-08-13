"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sendMagicLink } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { FOCUS_RING } from "@/lib/styles";

const INPUT_SURFACE =
  "w-full rounded-full border border-ink/5 bg-white px-5 py-3 text-base text-ink shadow-[0_1px_2px_rgba(31,42,36,0.04),0_8px_20px_-8px_rgba(31,42,36,0.12)] placeholder:text-muted/70";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Sending…" : "Send me a login link"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(sendMagicLink, {});

  if (state.success) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col justify-center gap-4 px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-ink">Check your email</h1>
        <p className="text-sm text-muted">
          We sent you a link to sign in. Click it and you&apos;ll be right back here.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-ink">Sign in</h1>
        <p className="text-sm text-muted">
          Enter your email and we&apos;ll send you a link to sign in — no password needed.
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className={`${INPUT_SURFACE} ${FOCUS_RING}`}
        />
        {state.error && (
          <p role="alert" className="text-sm text-tomato">
            {state.error}
          </p>
        )}
        <SubmitButton />
      </form>
    </main>
  );
}
