import { prismaclient } from "@/app/lib/db";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn({ user }) {
      console.log("Signing in user:", user);

      if (!user.email) {
        console.error("User email is missing during sign-in.");
        return false;
      }

      try {
        // Check if the user already exists in the database
        const existingUser = await prismaclient.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create a new user only if they don't already exist
          await prismaclient.user.create({
            data: {
              email: user.email,
              provider: "Google",
            },
          });
          console.log("New user created:", user.email);
        } else {
          console.log("User already exists:", user.email);
        }

        return true; // Allow sign-in
      } catch (e) {
        console.error("Error during sign-in:", e);
        return false; // Deny sign-in if an error occurs
      }
    },
  },
});

export { handler as GET, handler as POST };
