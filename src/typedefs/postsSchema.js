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
    getMyPostsWithPagination(page: Int, limit: Int): PostPaginator!
    getPostsWithPagination(page: Int, limit: Int, user_id: ID): PostPaginator!
    poster(first:Int,skip:Int):[Post]
    
  }
  extend type Mutation {
    createPost(title: String!, content: String!): Post!
    updatePost(title:String!,content:String!,id:ID!):Post
    deletePost(id:ID!):DeletePostPayload!
  }
  type Paginator {
        slNo: Int
        prev: Int
        next: Int
        perPage: Int
        totalPosts: Int
        totalPages: Int
        currentPage: Int
        hasPrevPage: Boolean
        hasNextPage: Boolean
    }
    type PostPaginator {
        posts: [Post]
        paginator: Paginator!
    }
    type PageInfo {
  endCursor: String!  
  hasNextPage: Boolean!
}

`;
