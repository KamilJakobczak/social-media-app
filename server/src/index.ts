import { ApolloServer } from 'apollo-server';
import { Query, Mutation, Profile, Post, User } from './resolvers'; //as long as you use index.ts inside /resolvers/ you don't need to specify the filename

import { typeDefs } from './schema';
import { PrismaClient, Prisma } from '@prisma/client';
import { getUserFromToken } from './utils/getUserFromToken';
const port: number = 4200;

const prisma = new PrismaClient();
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  userInfo: {
    userId: number;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User,
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization);
    return { prisma, userInfo };
  },
  csrfPrevention: true,
});

server
  .listen({
    port,
  })
  .then(({ url }) => {
    console.log(`Server ready on ${url}`);
  });
