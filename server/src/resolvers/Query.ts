import { Context } from '..';

export const Query = {
  posts: async (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
  },
};
