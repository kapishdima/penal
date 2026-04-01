"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { AuthIllustration } from "../_components/auth-illustration";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setError(error.message ?? "Failed to create account");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-muted/30 border-r">
        <div />
        <AuthIllustration />
        <div className="max-w-md">
          <h1 className="text-4xl font-heading font-extrabold tracking-tight leading-[1.1]">
            Start organizing
            <br />
            <span className="text-muted-foreground">your&nbsp;way.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Drag widgets onto an infinite canvas —{" "}
            <b>notes, tasks, habits, finances.</b> Everything in one place,
            arranged how you&nbsp;think.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col justify-center px-6 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <p className="text-sm font-medium text-muted-foreground">
            Get started
          </p>
          <h2 className="mt-1 text-2xl font-heading font-bold tracking-tight">
            Create your account
          </h2>

          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </Field>
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
                name="new-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </Field>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full mt-1">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
