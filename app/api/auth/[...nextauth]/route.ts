// // app/api/auth/[...nextauth]/route.js
// import NextAuth from "next-auth";
// import GitHubProvider from "next-auth/providers/github";

// export const authOptions = {
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//       authorization: { params: { scope: "read:user repo" } },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account }) {
//       // Persist the access token after login
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Make the token available in the client
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import GithubProvider from "next-auth/providers/github";

// export const authOptions = {
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//       authorization: { params: { scope: "read:user repo" } }, // optional, adjust scopes
//     }),
//   ],
//   callbacks: {
//     // Called whenever a JWT is created or updated
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token; // store GitHub token in JWT
//       }
//       return token;
//     },

//     // Called whenever a session is checked / returned
//     async session({ session, token }) {
//       session.accessToken = token.accessToken; // expose access token to client
//       return session;
//     },
//   },
//   // Optional: to avoid "state cookie missing" in ngrok
//   // allowedDevOrigins: ["https://your-ngrok-domain.ngrok-free.dev"],
// };

// export default NextAuth(authOptions);
// export { handler as GET, handler as POST };

// import NextAuth from "next-auth";
// import GitHubProvider from "next-auth/providers/github";

// export default NextAuth({
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//       authorization: {
//         params: {
//           scope: "read:user user:email repo",
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, account, profile }) {
//       console.log("🪙 JWT Callback:");
//       console.log("Token:", token);
//       console.log("Account:", account);
//       console.log("Profile:", profile);

//       if (account) {
//         token.accessToken = account.access_token;
//         token.id = profile?.sub;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       console.log("💼 Session Callback:");
//       console.log("Session:", session);
//       console.log("Token:", token);

//       if (session.user) {
//         session.user.id = token.sub!;
//         session.accessToken = token.accessToken as string;
//       }
//       return session;
//     },
//   },
//   debug: true,
// });

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//   }
// }

// export { handler as GET, handler as POST };
// import NextAuth from "next-auth";

import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

// Define auth options with proper types
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    // Type the parameters
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account?: any;
      profile?: any;
    }) {
      console.log("🪙 JWT Callback:", { token, account, profile });

      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id ?? account?.providerAccountId;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      console.log("💼 Session Callback:", { session, token });

      if (session.user) {
        session.user.id = token.id;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Extend Session type
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
