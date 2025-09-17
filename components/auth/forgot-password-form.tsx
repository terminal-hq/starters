"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export interface ForgotPasswordFormProps {
  onSuccess?: () => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = String(form.get("email") || "");
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const redirectTo = `${window.location.origin}/?auth=reset`;
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo,
      });
      if (error) {
        toast.error(error.message || "Couldn't send reset email");
      } else {
        toast.success("Password reset email sent (check your inbox)");
        setEmailSent(true);
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-4 text-sm">
        <p>
          If an account exists for that email, a password reset link has been
          sent. It may take a minute to arrive.
        </p>
        <p>
          Didn&apos;t get it? You can submit the form again or contact support.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading} aria-live="polite">
      <fieldset disabled={loading} className="flex flex-col gap-6">
        <div className="grid gap-3">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {loading ? "Sending" : "Send reset link"}
        </Button>
      </fieldset>
    </form>
  );
}
