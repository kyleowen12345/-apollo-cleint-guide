import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools'
import typdefs from '../../src/typedefs/index.js'
import resolvers from '../../src/resolvers/index.js'
import userModel from '../../models/userModel'
import postsModel from '../../models/postsModel'
import commentsModel from '../../models/commentsModel'




dotenv.config();

const getUser = async (req) => {
  const token = req.headers['token'];

  if (token) {
    try {
      return await jwt.verify(token, 'riddlemethis');
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};
export const schema = makeExecutableSchema({
  typeDefs:typdefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    if (req) {
      const me = await getUser(req);

      return {
        me,
        models: {
          userModel,
          postsModel,
          commentsModel
        },
      };
    }
  },
})
mongoose.connect(
  process.env.MONGO_DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },()=>
    console.log("connected to mongoDB")
);

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })






