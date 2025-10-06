"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Link from "next/link";
import Logo from "../logo";

type AuthView = "login" | "signup" | "forgot" | "reset";

function getTitles(view: AuthView): { title: string; description?: string } {
  switch (view) {
    case "login":
      return { title: "Login", description: "Access your account" };
    case "signup":
      return { title: "Sign up", description: "Create a new account" };
    case "forgot":
      return {
        title: "Forgot password",
        description: "We'll email you a reset link",
      };
    case "reset":
      return {
        title: "Reset password",
        description: "Choose a new secure password",
      };
  }
}

export function AuthModal() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const viewParam = search.get("auth");
  const token = search.get("token");
  const isValidView = ["login", "signup", "forgot", "reset"].includes(
    viewParam || ""
  );
  const view = isValidView ? (viewParam as AuthView) : null;
  const open = Boolean(view);

  function buildSearchWithoutAuth() {
    const params = new URLSearchParams(search.toString());
    params.delete("auth");
    if (view === "reset") params.delete("token");
    const s = params.toString();
    return s ? `${pathname}?${s}` : pathname;
  }

  function setAuthView(next: AuthView | null) {
    const params = new URLSearchParams(search.toString());
    if (next) {
      params.set("auth", next);
    } else {
      params.delete("auth");
      params.delete("token");
    }
    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`
    );
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      router.replace(buildSearchWithoutAuth());
    }
  }

  if (!open) return null;

  const { title, description } = getTitles(view as AuthView);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-3 text-center space-y-2">
          <div className="mx-auto h-8 w-8 rounded grid place-items-center text-xs font-semibold">
            <Logo />
          </div>
          <div className="space-y-1">
            <DialogHeader className="gap-1">
              <DialogTitle className="text-base font-semibold tracking-tight text-center">
                {view === "login" || view === "signup" ? "Welcome" : title}
              </DialogTitle>
              <DialogDescription className="text-xs text-popover-foreground/50 text-center">
                {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        <div className="px-6 pb-6 space-y-6">
          {(view === "login" || view === "signup") && (
            <SocialSection
              view={view}
              onSelectForgot={() => setAuthView("forgot")}
              onSwitchView={() =>
                setAuthView(view === "login" ? "signup" : "login")
              }
              renderForm={() =>
                view === "login" ? (
                  <LoginForm onSuccess={() => handleOpenChange(false)} />
                ) : (
                  <SignupForm onSuccess={() => handleOpenChange(false)} />
                )
              }
            />
          )}
          {view === "forgot" && (
            <div className="space-y-6">
              <ForgotPasswordForm />
              <p className="text-xs text-center text-popover-foreground/50">
                Remembered it?{" "}
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="underline underline-offset-4"
                >
                  Back to login
                </button>
              </p>
            </div>
          )}
          {view === "reset" && (
            <div className="space-y-6">
              <ResetPasswordForm
                token={token}
                onSuccess={() => setAuthView("login")}
              />
              <p className="text-xs text-center text-popover-foreground/50">
                <button
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="underline underline-offset-4"
                >
                  Back to login
                </button>
              </p>
            </div>
          )}
          {view === "signup" && (
            <p className="text-[10px] leading-relaxed text-center text-popover-foreground/50">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4">
                Terms of Service
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SocialSectionProps {
  view: "login" | "signup";
  onSwitchView: () => void;
  onSelectForgot: () => void;
  renderForm: () => React.ReactNode;
}

function SocialSection({
  view,
  onSwitchView,
  onSelectForgot,
  renderForm,
}: SocialSectionProps) {
  return (
    <div className="space-y-6">
      <SocialAuthButtons />
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-wide text-popover-foreground/50">
        <span className="h-px flex-1 bg-muted" />
        OR
        <span className="h-px flex-1 bg-muted" />
      </div>
      {renderForm()}
      <div className="space-y-2 text-center text-xs text-popover-foreground/50">
        {view === "login" && (
          <>
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={onSwitchView}
                className="underline underline-offset-4"
              >
                Sign up
              </button>
            </p>
            <p>
              <button
                type="button"
                onClick={onSelectForgot}
                className="underline underline-offset-4"
              >
                Forgot your password?
              </button>
            </p>
          </>
        )}
        {view === "signup" && (
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchView}
              className="underline underline-offset-4"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
