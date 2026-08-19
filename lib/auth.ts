import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Only Google Workspace accounts on this domain may access the internal portal.
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN ?? "contentstack.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          hd: ALLOWED_DOMAIN, // hints Google to show only this workspace's accounts
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const email = profile?.email ?? "";
      return email.endsWith(`@${ALLOWED_DOMAIN}`);
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/internal/sign-in",
    error: "/internal/sign-in",
  },
};
