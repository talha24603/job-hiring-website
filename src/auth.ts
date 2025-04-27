import NextAuth, { AuthError } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "./prismaClient"
import { compare } from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // ─── COOKIE CONFIG ────────────────────────────────────────────────────────────
  cookies: process.env.NODE_ENV === "production" ? {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
        domain: process.env.DOMAIN,  // ← replace with your real domain
      },
    },
    csrfToken: {
      name: "__Secure-next-auth.csrf-token",
      options: {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: true,
        domain: process.env.DOMAIN,
      },
    },
    callbackUrl: {
      name: "__Secure-next-auth.callback-url",
      options: {
        sameSite: "none",
        path: "/",
        secure: true,
        domain: process.env.DOMAIN,
      },
    },
    state: {
      name: "__Secure-next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
        domain: process.env.NEXT_PUBLIC_APP_URL,
      },
    },
  } : {},

  // ─── PROVIDERS ────────────────────────────────────────────────────────────────
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) throw new Error("invalid email or password")
        const isMatch = await compare(credentials.password, user.password || "")
        if (!isMatch) throw new Error("incorrect password")
        return { id: user.id, name: user.name, email: user.email, isVerified: user.isVerified, role: user.role }
      },
    }),
  ],

  // ─── CORE CONFIG ─────────────────────────────────────────────────────────────
  secret: process.env.AUTH_SECRET,
  debug: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const existing = await prisma.user.findUnique({ where: { email: user.email! } })
          if (!existing) {
            await prisma.user.create({
              data: { 
                id: user.id, name: user.name!, email: user.email!, image: user.image, isVerified: true, provider: "google" 
              },
            })
          }
          return true
        } catch {
          throw new AuthError("Error while creating user")
        }
      }
      return true  // allow credentials sign-in
    },
    async jwt({ token, user }) {
      // Initial sign-in: `user` is present
      if (user) {
        // If credentials provider, profile already has role/isVerified
        // If Google provider, profile has no role → fetch from DB
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.id         = dbUser.id;
          token.name       = dbUser.name;
          token.email      = dbUser.email;
          token.role       = dbUser.role;       // now "UNASSIGNED" or whatever
          token.isVerified = dbUser.isVerified;
          token.image      = dbUser.image;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        isVerified: token.isVerified as boolean,
        image: token.image as string,
        emailVerified: null,
      }
      // Refresh role/image from database on every session call
      const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } })
      if (dbUser) {
        session.user.role = dbUser.role
        session.user.image = dbUser.image as string
      }
      return session
    },
  },
})
