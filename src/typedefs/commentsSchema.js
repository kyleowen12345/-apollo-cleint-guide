import {gql} from 'apollo-server'

export default  gql`
 type Comment {
     id:ID!
     comment:String!
     postsId:Post
     
 }
 
 type DeleteCommentPayload{
     id:ID!
 }
 extend type Query {
     commentsToPost: [Comment!]!
 }
 extend type Mutation {
    createComment(comment:String!,postsId:ID!):Comment!
    updateComment(id: ID!, input: String!): Comment!
   deleteComment(id:ID!):DeleteCommentPayload!
 }
`