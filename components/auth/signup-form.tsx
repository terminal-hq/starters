"use client";

import * as React from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [passwordValue, setPasswordValue] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState<string[]>([]);
  const [showPasswordErrors, setShowPasswordErrors] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    if (!email || !password || !name) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const validationErrors = validatePassword(password);
    if (validationErrors.length) {
      toast.error("Password doesn't meet requirements");
      setPasswordErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });
      if (error) {
        toast.error(error?.message ?? "An error occurred");
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
      className="space-y-6"
    >
      <fieldset disabled={loading} className="flex flex-col gap-3">
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <div className="grid gap-3">
          <Input
            id="password"
            name="password"
            type="password"
            value={passwordValue}
            onChange={(e) => {
              const val = e.target.value;
              setPasswordValue(val);
              setPasswordErrors(validatePassword(val));
            }}
            onBlur={() => {
              if (passwordValue) {
                setShowPasswordErrors(true);
              }
            }}
            onFocus={() => setShowPasswordErrors(false)}
            placeholder="Enter your password"
            required
            aria-describedby="password-help"
          />
          <p
            id="password-help"
            className={`text-xs min-h-[1.25rem] ${
              showPasswordErrors && passwordErrors.length > 0
                ? "text-destructive"
                : "text-transparent"
            }`}
          >
            {
              showPasswordErrors && passwordErrors.length > 0
                ? `${passwordErrors[0].toLowerCase()}`
                : "‌" // invisible character to maintain height
            }
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            variant={"secondary"}
            disabled={loading || passwordErrors.length > 0 || !passwordValue}
            aria-disabled={
              loading || passwordErrors.length > 0 || !passwordValue
            }
          >
            {loading && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {loading ? "Signing up" : "Sign up"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

export function validatePassword(pw: string) {
  const errs: string[] = [];
  if (pw.length < 8) errs.push("At least 8 characters");
  if (!/[a-z]/.test(pw)) errs.push("At least one lowercase letter");
  if (!/[A-Z]/.test(pw)) errs.push("At least one uppercase letter");
  if (!/[0-9]/.test(pw)) errs.push("At least one number");
  if (!/[^A-Za-z0-9]/.test(pw)) errs.push("At least one symbol");
  return errs;
}
