import { AuthenticationError } from 'apollo-server';

export default {
  Query: {
    post: async (parent, { id }, { models: { postsModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const post = await postsModel.findById({ _id: id }).exec();
      return post;
    },
    posts: async (parent, args, { models: { postsModel }, me }, info) => {
      // if (!me) {
      //   throw new AuthenticationError('You are not authenticated');
      // }
      
      const posts = await postsModel.find({ }).exec();
      return posts;
    },
  },
  Mutation: {
    createPost: async (parent, { title, content }, { models: { postsModel }, me }, info) => {
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      const post = await postsModel.create({ title, content, author: me.id });
      return post;
    },
    deletePost:async (parent,{id},{models: { postsModel }, me },info)=>{
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
        
      }
      const deletePost=await postsModel.deleteOne({_id:id})
      if(deletePost.deletedCount) return{id: id}
          else throw new ApolloError(`Failed to delete Post.`);
    },
    updatePost:async (parent,{title,content,id},{models:{postsModel},me},info)=>{
      if (!me) {
        throw new AuthenticationError('You are not authenticated');
      }
      console.log(me)
      try {
        const post = await postsModel.findOne({ _id:id});
        console.log( me.id)
        console.log( post.author)
        if(post.author.toString() !== me.id) return new AuthenticationError('You are did not post this')
      post.title=title
      post.content=content
      post.save()
      return post;
      } catch (error) {
        console.log(error)
      }
      
      
    }
  },
  Post: {
    author: async ({ author }, args, { models: { userModel } }, info) => {
      const user = await userModel.findById({ _id: author }).exec();
      return user;
    },
    comments: async ({ id }, args, { models: { commentsModel } }, info) => {
      console.log(id)
      const comment = await commentsModel.find({ postsId: id }).exec();
      return comment;
    },
  },
};