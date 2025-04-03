import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  // You can add additional NextAuth options here.
};

const handler = NextAuth(authOptions);

// Export GET and POST handlers for the API route.
export { handler as GET, handler as POST };
