// src/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type
   */
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'salesperson';
    } & DefaultSession["user"];
  }

  /**
   * Extends the built-in user type
   */
  interface User extends DefaultUser {
      role: 'admin' | 'salesperson';
      fullName?: string | null;
      _id: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT type
   */
    interface JWT extends DefaultJWT {
      id: string;
    role: 'admin' | 'salesperson';
  }
}