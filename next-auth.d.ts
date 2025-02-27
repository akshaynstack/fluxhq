// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Add role here
    };
  }

  interface Token {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null; // Add role here
    picture?: string | null; // Add picture here if needed
  }
}