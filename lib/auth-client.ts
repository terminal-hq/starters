import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [
    genericOAuthClient(), // This will enable the generic OAuth client
  ],
});
export const { signIn, signUp, useSession, signOut } = authClient;
