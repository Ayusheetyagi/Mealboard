import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md flex-col justify-center gap-4 px-6 py-16 text-center">
      <h1 className="font-display text-3xl text-ink">That link didn&apos;t work</h1>
      <p className="text-sm text-muted">
        It may have expired or already been used. Try signing in again.
      </p>
      <Link href="/login" className="text-sm text-tomato underline underline-offset-4">
        Back to sign in
      </Link>
    </main>
  );
}
