import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { query } from "../../../lib/db";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        const { email, name, image } = user;
        const provider = account.provider;
        const providerId = account.providerAccountId;
  
        const existingUser = await query(
          "SELECT * FROM users WHERE email = $1 AND provider = $2",
          [email, provider]
        );
  
        if (existingUser.rows.length === 0) {
       
          await query(
            "INSERT INTO users (name, email, image, provider, provider_id) VALUES ($1, $2, $3, $4, $5)",
            [name, email, image, provider, providerId]
          );
        }
  
        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return false;
      }
    },
  },
  
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
