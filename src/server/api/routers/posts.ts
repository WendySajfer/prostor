import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc'

import { type PostShortInfo } from '../helpers/posts/types'

export const postInputSchema = {
  title: z.string().max(50).min(1),
  body: z.string().max(1000).min(1),
}

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object(postInputSchema))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user

      return ctx.db.post.create({
        data: {
          title: input.title,
          body: input.body,
          createdBy: { connect: { id: user.id } },
        },
      })
    }),
  getFeed: publicProcedure.query(async ({ ctx }) => {
    const current_user_id = ctx.session?.user.id
    const feed = (await ctx.db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        body: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likers: current_user_id ? {
          select: {
            id: true
          },
          where: {
            id: current_user_id
          }
        } : undefined,
        likes: true,
        updatedAt: false
      },
    })) as Array<PostShortInfo>
    return feed
  }),
  postLike: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      const user = ctx.session.user
      try {
        const existLike = await ctx.db.post.findFirst({
          select: {
            id: true,
          },
          where: {
            id: id,
            likers: {
              some: {
                id: user.id,
              },
            },
          },
        })
        if (existLike) {
          await ctx.db.post.update({
            data: {
              likers: {
                disconnect: {
                  id: user.id,
                },
              },
              likes: {
                decrement: 1,
              },
            },
            where: { id: id },
          })
        } else {
          await ctx.db.post.update({
            data: {
              likers: {
                connect: {
                  id: user.id,
                },
              },
              likes: {
                increment: 1,
              },
            },
            where: { id: id },
          })
        }
        return existLike
      } catch (e) {
        console.log(e)
        return { message: 'Database Error: Failed Liked' }
      }
    }),
})
