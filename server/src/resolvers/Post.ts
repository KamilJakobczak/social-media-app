import { Context } from '..';
interface PostParentType {
  authorId: number;
}
export const Post = {
  user: async (
    parent: PostParentType,
    __: any,
    { userInfo, prisma }: Context
  ) => {
    return prisma.user.findUnique({
      where: { id: parent.authorId },
    });
  },
};
