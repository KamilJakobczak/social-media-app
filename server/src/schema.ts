import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }
  type Mutation {
    postCreate(input: PostInput!): PostPayload!
    postUpdate(postId: ID!, input: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!): PostPayload!
    postUnpublish(postId: ID!): PostPayload!
    signup(
      credentials: CredentialsInput!
      name: String!
      bio: String!
    ): AuthPayload
    signin(credentials: CredentialsInput!): AuthPayload!
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }
  type User {
    id: ID!
    name: String
    email: String!
    posts: [Post!]!
  }
  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type userError {
    message: String!
  }
  input PostInput {
    title: String
    content: String
  }

  type PostPayload {
    userErrors: [userError!]!
    post: Post
  }
  type AuthPayload {
    userErrors: [userError!]!
    token: String
  }
  input CredentialsInput {
    email: String!
    password: String!
  }
`;
