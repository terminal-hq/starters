"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface SocialAuthButtonsProps {
  callbackURL?: string;
  onSuccess?: () => void;
}

export function SocialAuthButtons({
  callbackURL = "/",
  onSuccess,
}: SocialAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(
    null
  );

  async function handleOAuth(providerId: string) {
    try {
      setLoadingProvider(providerId);
      const { error } = await authClient.signIn.oauth2({
        providerId,
        callbackURL,
      });
      if (error) {
        toast.error(error.message || `Unable to continue with ${providerId}`);
      } else {
        onSuccess?.();
      }
    } finally {
      setLoadingProvider(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        disabled={!!loadingProvider}
        onClick={() => handleOAuth("google")}
      >
        {loadingProvider === "google" && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        Continue with Google
      </Button>
      {/* {showMicrosoft && (
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center font-medium bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700 text-neutral-50"
          size={size}
          disabled={!!loadingProvider}
          onClick={() => handleOAuth("microsoft")}
        >
          {loadingProvider === "microsoft" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          Continue with Microsoft
        </Button>
      )} */}
    </div>
  );
}
