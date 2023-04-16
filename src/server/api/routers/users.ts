import { faker } from '@faker-js/faker'
import { createId } from '@paralleldrive/cuid2'
import { v2 as cloudinary } from 'cloudinary'
import { eq } from 'drizzle-orm/expressions'

import { UserProfileInputSchema, UserSchema } from '@/modules/user/model'
import { users } from '@/db/schema'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  createGuestUser: publicProcedure.mutation(async ({ ctx }) => {
    const newUserId = createId()

    await ctx.db.insert(users).values({
      id: newUserId,
      email: faker.internet.email().toLocaleLowerCase(),
      userType: 'guest',
      emailVerified: new Date(),
    })

    return await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, newUserId))
      .then(res => res[0] ?? null)
  }),
  getUserProfile: protectedProcedure.output(UserSchema).query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const rows = await ctx.db.select().from(users).where(eq(users.id, userId))
    const result = rows[0]

    if (!result) throw new Error('Unable to fetch user profile')

    return result
  }),
  updateUserProfile: protectedProcedure
    .input(UserProfileInputSchema)
    .output(UserSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      if (input.image) {
        const uploadResponse = await cloudinary.uploader.upload(input.image, {
          overwrite: true,
          invalidate: true,
          public_id: userId + '_profile',
          folder: 'thullo',
          resource_type: 'image',
          eager: { width: 300, height: 300, quality: 70 },
        })

        input.image = uploadResponse.secure_url
      }

      await ctx.db.update(users).set(input).where(eq(users.id, userId))

      const rows = await ctx.db.select().from(users).where(eq(users.id, userId))
      const result = rows[0]

      if (!result) throw new Error('User not found')

      return result
    }),
})
