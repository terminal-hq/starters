import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/queries";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/lib/terminal/email";
import { googleOAuthProxyPlugin } from "./terminal/oauth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        data: {
          resetLink: url,
          type: "reset-password",
        },
      });
    },
  },
  plugins: [
    googleOAuthProxyPlugin(), // Note: This is a Google OAuth proxy plugin for testing purposes, for production, use OAuth with your own client ID and secret for better security
    nextCookies(), // Make sure this is the last plugin in the array, this which will automatically set cookies for you whenever a Set-Cookie header is present in the response
  ],
});
