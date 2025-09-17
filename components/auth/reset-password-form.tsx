"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { validatePassword } from "./signup-form";

export interface ResetPasswordFormProps {
  token?: string | null;
  onSuccess?: () => void;
}

export function ResetPasswordForm({
  token,
  onSuccess,
}: ResetPasswordFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [passwordValue, setPasswordValue] = React.useState("");
  const [confirmValue, setConfirmValue] = React.useState("");
  const [passwordErrors, setPasswordErrors] = React.useState<string[]>([]);
  const [showPasswordErrors, setShowPasswordErrors] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      toast.error("Missing reset token. Request a new link.");
      return;
    }
    if (passwordValue !== confirmValue) {
      toast.error("Passwords do not match");
      return;
    }
    const validationErrors = validatePassword(passwordValue);
    if (validationErrors.length) {
      toast.error("Password doesn't meet requirements");
      setPasswordErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      const { error } = await authClient.resetPassword({
        newPassword: passwordValue,
        token,
      });
      if (error) {
        toast.error(error.message || "Reset failed");
      } else {
        toast.success("Password updated. You can now log in.");
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm">
        Invalid or missing token. Request a new password reset email.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading} aria-live="polite">
      <fieldset disabled={loading} className="flex flex-col gap-3">
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your new password"
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
          aria-describedby="password-help"
        />

        <Input
          id="confirm"
          name="confirm"
          type="password"
          placeholder="Confirm your new password"
          required
          value={confirmValue}
          onChange={(e) => setConfirmValue(e.target.value)}
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
        <div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              passwordErrors.length > 0 ||
              !passwordValue ||
              !confirmValue
            }
            aria-disabled={
              loading ||
              passwordErrors.length > 0 ||
              !passwordValue ||
              !confirmValue
            }
          >
            {loading && (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {loading ? "Updating" : "Reset password"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
