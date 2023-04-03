import { faker } from '@faker-js/faker'

import { UserSchema } from '@/modules/user/model'
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
})
