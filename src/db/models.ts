import { type InferModel } from 'drizzle-orm'

import { type users } from './schema'

export type UserModel = InferModel<typeof users>
export type NewUserModel = InferModel<typeof users, 'insert'>
