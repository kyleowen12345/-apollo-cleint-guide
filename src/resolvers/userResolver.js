import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export default {
  Query: {
    user: async (parent, {}, { models: { userModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      console.log(me.id)
      const user = await userModel.findById({ _id: me.id }).exec();
      return user;
    },
    
    
  },
  Mutation: {
    createUser: async (parent, { name, password }, { models: { userModel } }, info) => {
      const user = await userModel.create({ name, password });
      return user;
    },
    login: async (parent, { name, password }, { models: { userModel } }, info) => {
      const user = await userModel.findOne({ name }).exec();

      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const matchPasswords = bcrypt.compareSync(password, user.password);

      if (!matchPasswords) {
        throw new AuthenticationError('Invalid credentials');
      }

      const token = jwt.sign({ id: user.id }, 'riddlemethis', { expiresIn: 24 * 10 * 50 });

      return {
        token,
        user:user
      };
    },
  },
  User: {
    posts: async ({ id }, args, { models: { postsModel } }, info) => {
      console.log(id)
      const posts = await postsModel.find({ author: id }).exec();
      return posts;
    },
  },
};