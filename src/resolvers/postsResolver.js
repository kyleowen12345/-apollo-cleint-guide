import { AuthenticationError } from 'apollo-server';

const PostLabels = {
  docs: 'posts',
  limit: 'perPage',
  nextPage: 'next',
  prevPage: 'prev',
  meta: 'paginator',
  page: 'currentPage',
  pagingCounter: 'slNo',
  totalDocs: 'totalPosts',
  totalPages: 'totalPages',
};
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
    getPostsWithPagination: async (_, {
      page,
      limit,
      user_id
  }, { models: { postsModel }, me }) => {

      const options = {
          page: page || 1,
          limit: limit || 10,
          customLabels: PostLabels,
          sort: {
              title: -1
          },
      };

      let query = {};
      if (user_id) {
          query = {
              author: user_id
          }
      }

      let posts = await postsModel.paginate(query, options);

      return posts;
  },
  getMyPostsWithPagination: async (_, {
    page,
    limit
}, { models: { postsModel }, me }) => {

    const options = {
        page: page || 1,
        limit: limit || 10,
        customLabels: PostLabels,
        sort: {
            createdAt: -1
        },
    };

    let posts = await postsModel.paginate({
        author: user.id
    }, options);

    return posts;
},
poster:async(_,{first,skip},{ models: { postsModel }, me })=>{
  const total=await postsModel.estimatedDocumentCount()
  console.log(total)
 const post= await postsModel.find({}).sort({"title":1}).skip(skip).limit(first).exec()
 while (await post.hasNext()) {
  console.log(await post.next());
}
 return post
}
    
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