import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  username: z.string().nullable(),
  image: z.string().nullable(),
  isGuest: z.boolean(),
  createdAt: z.date(),
})

export type User = z.infer<typeof UserSchema>
