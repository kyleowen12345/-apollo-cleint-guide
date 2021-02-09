import userSchema from './userSchema.js';
import postSchema from './postsSchema.js';
import commentsSchema from './commentsSchema.js'
import { gql } from 'apollo-server';

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, postSchema, commentsSchema];