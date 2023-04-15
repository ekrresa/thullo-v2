import { createId } from '@paralleldrive/cuid2'
import { and, eq } from 'drizzle-orm/expressions'
import type { Adapter } from 'next-auth/adapters'

import { type db } from '.'
import { accounts, sessions, users, verificationTokens } from './schema'

/** @return { import("next-auth/adapters").Adapter } */
export default function MyAdapter(client: typeof db): Adapter {
  return {
    async createUser(user) {
      const userId = createId()
      await client.insert(users).values({ ...user, id: userId })

      const rows = await client.select().from(users).where(eq(users.id, userId))
      const newUser = rows[0]
      if (!newUser) throw new Error('User not found')

      return newUser
    },
    async getUser(id) {
      const rows = await client.select().from(users).where(eq(users.id, id))

      return rows[0] ?? null
    },
    async getUserByEmail(email) {
      const rows = await client.select().from(users).where(eq(users.email, email))

      return rows[0] ?? null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client
        .select()
        .from(users)
        .innerJoin(
          accounts,
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        )
        .then(res => res[0])

      return account?.users ?? null
    },
    async updateUser(user) {
      if (!user.id) throw new Error('User not found')

      await client.update(users).set(user).where(eq(users.id, user.id))

      const rows = await client.select().from(users).where(eq(users.id, user.id))

      const row = rows[0]
      if (!row) throw new Error('User not found')

      return row
    },
    async deleteUser(userId) {
      await client.delete(accounts).where(eq(accounts.userId, userId))
      await client.delete(users).where(eq(users.id, userId))
    },
    async linkAccount(account) {
      const accountId = createId()

      await client
        .insert(accounts)
        .values({ ...account, id: accountId })
        .then(res => res)
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, providerAccountId),
            eq(accounts.provider, provider)
          )
        )
    },
    async createSession({ sessionToken, userId, expires }) {
      const sessionId = createId()

      await client
        .insert(sessions)
        .values({ id: sessionId, sessionToken, userId, expires })

      const rows = await client
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))

      const row = rows[0]
      if (!row) throw new Error('User not found')

      return row
    },
    async getSessionAndUser(sessionToken) {
      return await client
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then(res => res[0] ?? null)
    },
    async updateSession({ sessionToken, expires, userId }) {
      await client
        .update(sessions)
        .set({ sessionToken, expires, userId })
        .where(eq(sessions.sessionToken, sessionToken))

      return client
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .then(res => res[0])
    },
    async deleteSession(sessionToken) {
      await client.delete(sessions).where(eq(sessions.sessionToken, sessionToken))
    },
    async createVerificationToken({ identifier, expires, token }) {
      await client.insert(verificationTokens).values({ identifier, expires, token })

      return client
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        )
        .then(res => res[0])
    },
    async useVerificationToken({ identifier, token }) {
      const rows = await client
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        )

      await client
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.identifier, identifier),
            eq(verificationTokens.token, token)
          )
        )

      return rows[0] ?? null
    },
  }
}
