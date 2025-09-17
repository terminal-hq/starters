import { genericOAuth } from "better-auth/plugins";

export function googleOAuthProxyPlugin() {
  return genericOAuth({
    config: [
      {
        providerId: "google",
        authorizationUrl: `${process.env.TERMINAL_END_POINT}/auth/google/start`,
        tokenUrl: `${process.env.TERMINAL_END_POINT}/auth/google/token`,
        scopes: ["openid", "email", "profile"],
        clientId: "not-needed",
        accessType: "offline",
      },
    ],
  });
}
