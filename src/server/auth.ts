import { type GetServerSidePropsContext } from 'next'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { TRPCError } from '@trpc/server'
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import EmailProvider from 'next-auth/providers/email'
import GitHubProvider from 'next-auth/providers/github'

import { userRouter } from '@/server/api/routers/users'
import { prisma } from '@/server/db'
import { env } from '@/env.mjs'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  pages: { signIn: '/auth' },
  session: {
    strategy: 'jwt',
  },
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      server: env.EMAIL_SERVER,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'guest_signup',
      type: 'credentials',
      credentials: {},
      async authorize() {
        const caller = userRouter.createCaller({ prisma, session: null })

        try {
          const user = await caller.createGuestUser()
          return user
        } catch (error) {
          // TODO: log error
          if (error instanceof TRPCError) {
            throw new Error(error.message)
          }

          throw new Error('Unable to create guest user. Please try again')
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }

      return session
    },
  },
}

export function getServerAuthSession(ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
