"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type LoginFormProps = {
  onSuccess?: () => void;
  callbackURL?: string;
};

export function LoginForm({ onSuccess, callbackURL = "/" }: LoginFormProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (!email || !password) {
      toast.error("Please provide both email and password.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL,
        rememberMe: false,
      });
      if (error) {
        toast.error(error?.message ?? "Sign in failed");
      } else {
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={loading}
      aria-live="polite"
      className={"space-y-6"}
    >
      <fieldset disabled={loading} className="flex flex-col gap-3">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        <div className="flex flex-col gap-3 pt-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            aria-disabled={loading}
            variant={"secondary"}
          >
            {loading && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {loading ? "Signing in" : "Login"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
