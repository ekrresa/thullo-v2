import { faker } from '@faker-js/faker'

import { createTRPCRouter, protectedProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  createGuestUser: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.create({
      data: {
        email: faker.internet.email(),
        isGuest: true,
        emailVerified: new Date(),
      },
    })
  }),
})
