import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/mysql-core'
import { type ProviderType } from 'next-auth/providers'

export const accounts = mysqlTable(
  'accounts',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    userId: varchar('userId', { length: 191 }).notNull(),
    type: text('type').$type<ProviderType>().notNull(),
    provider: varchar('provider', { length: 191 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 191 }).notNull(),
    refresh_token: text('refresh_token'),
    refresh_token_expires_in: int('refresh_token_expires_in'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  accounts => {
    return {
      providerProviderAccountIdIndex: uniqueIndex(
        'accounts__provider__providerAccountId__idx'
      ).on(accounts.provider, accounts.providerAccountId),
      userIdIdx: index('accounts__userId__idx').on(accounts.userId),
    }
  }
)

export const sessions = mysqlTable(
  'sessions',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar('sessionToken', { length: 191 }).notNull(),
    userId: varchar('userId', { length: 191 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  session => {
    return {
      sessionTokenIndex: uniqueIndex('sessions__sessionToken__idx').on(
        session.sessionToken
      ),
      userIdIndex: index('session__userId__idx').on(session.userId),
    }
  }
)

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 191 }).primaryKey().notNull(),
    name: varchar('name', { length: 191 }),
    email: varchar('email', { length: 191 }).notNull(),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    username: varchar('username', { length: 100 }),
    userType: mysqlEnum('userType', ['user', 'guest']).notNull().default('user'),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  },
  users => {
    return {
      emailIndex: uniqueIndex('email_idx').on(users.email),
      usernameIndex: uniqueIndex('username_idx').on(users.username),
    }
  }
)

export const verificationTokens = mysqlTable(
  'verificationToken',
  {
    identifier: varchar('identifier', { length: 191 }).primaryKey().notNull(),
    token: varchar('token', { length: 191 }).notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  vt => ({
    tokenIndex: uniqueIndex('vt__token__idx').on(vt.token),
  })
)
