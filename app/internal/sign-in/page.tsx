"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold mb-3">Designer sign-in</h1>
      <p className="text-subtle mb-8">
        This portal is restricted to Contentstack designers. Sign in with your
        Google Workspace account.
      </p>
      <button
        onClick={() => signIn("google", { callbackUrl: "/internal" })}
        className="rounded-full bg-amethyst text-on-accent font-medium px-6 py-3 hover:opacity-90 transition-opacity"
      >
        Continue with Google
      </button>
    </div>
  );
}
