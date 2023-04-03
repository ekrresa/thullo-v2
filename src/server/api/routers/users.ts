import { faker } from '@faker-js/faker'
import { v2 as cloudinary } from 'cloudinary'

import { UserProfileInputSchema, UserSchema } from '@/modules/user/model'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  createGuestUser: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.create({
      data: {
        email: faker.internet.email().toLocaleLowerCase(),
        isGuest: true,
        emailVerified: new Date(),
      },
    })
  }),
  getUserProfile: protectedProcedure.output(UserSchema).query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    return await ctx.prisma.user.findUniqueOrThrow({ where: { id: userId } })
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

      return await ctx.prisma.user.update({ data: input, where: { id: userId } })
    }),
})
