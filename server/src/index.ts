import { ApolloServer } from 'apollo-server';
import { Query, Mutation } from './resolvers'; //as long as you use index.ts inside /resolvers/ you don't need to specify the filename
import { typeDefs } from './schema';
import { PrismaClient, Prisma } from '@prisma/client';
const port: number = 4200;

const prisma = new PrismaClient();
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: { prisma },
  csrfPrevention: true,
});

server
  .listen({
    port,
  })
  .then(({ url }) => {
    console.log(`Server ready on ${url}`);
  });
