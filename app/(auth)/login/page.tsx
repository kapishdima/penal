"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { AuthIllustration } from "../_components/auth-illustration";
import { GitHubSignInButton } from "../_components/github-button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Failed to sign in");
      setLoading(false);
      return;
    }

    router.push("/canvas");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-muted/30 border-r">
        <div />
        <AuthIllustration />
        <div className="max-w-md">
          <h1 className="text-4xl font-heading font-extrabold tracking-tight leading-[1.1]">
            Your productivity,
            <br />
            <span className="text-muted-foreground">one&nbsp;canvas.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Pennal collects your widgets — <b>tasks, notes, habits, timers</b> — on
            an infinite board you arrange however you&nbsp;think.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Welcome back
          </p>
          <h2 className="mt-1 text-2xl font-heading font-bold tracking-tight">
            Sign in to Pennal
          </h2>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                name="current-password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </Field>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4">
            <GitHubSignInButton />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
