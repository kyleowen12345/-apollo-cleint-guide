import { gql } from 'apollo-server';

export default gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments:[Comment]
  }
  type DeletePostPayload{
     id:ID!
 }
  extend type Query {
    post(id: ID!): Post!
    posts: [Post]
  }
  extend type Mutation {
    createPost(title: String!, content: String!): Post!
    updatePost(title:String!,content:String!,id:ID!):Post
    deletePost(id:ID!):DeletePostPayload!
  }
`;
