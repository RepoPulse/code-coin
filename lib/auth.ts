import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("🪙 JWT Callback:");
      console.log("Token:", token);
      console.log("Account:", account);
      console.log("Profile:", profile);
      
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.sub;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("💼 Session Callback:");
      console.log("Session:", session);
      console.log("Token:", token);
      
      if (session.user) {
        session.user.id = token.sub!;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  debug: true,
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}