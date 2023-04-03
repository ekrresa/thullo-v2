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

export const UserProfileInputSchema = z.object({
  image: z.string().trim().optional(),
  username: z
    .string()
    .trim()
    .min(2, 'Username must have at least 2 characters')
    .max(20, 'Username must be less than 20 characters')
    .optional(),
  name: z.string().trim().optional(),
})

export type UserProfileInput = z.infer<typeof UserProfileInputSchema>
