import { AuthenticationError } from 'apollo-server';

export default {
     Query:{
        commentsToPost:async (parent,{},{models:{commentsModel},me},info)=>{
            // if (!me) {
            //     throw new AuthenticationError('You are not authenticated');
            //   }
            //   console.log(me)
              const comments=await commentsModel.find({}).exec()
              console.log(comments)
              return comments
        }
     },
     Mutation:{
        createComment: async(parent, {comment,postsId}, {models:{commentsModel},me},info)=>{
         if (!me) {
            throw new AuthenticationError('You are not authenticated');
          }
          console.log(me)
              const comments=await commentsModel.create({comment,postsId})
              return comments
        },
        deleteComment:async(parent,{id},{models:{commentsModel},me},info)=>{
         if (!me) {
            throw new AuthenticationError('You are not authenticated');
          }
          console.log(me)
          const deleteComment=await commentsModel.deleteOne({_id:id})
          if(deleteComment.deletedCount) return{id: id}
          else throw new ApolloError(`Failed to delete Comment.`);
        },
        updateComment:async(parent,{id,input},{models:{commentsModel},me},info)=>{
         if (!me) {
            throw new AuthenticationError('You are not authenticated');
          }
          const commentsToUpdate=await commentsModel.findOne({_id:id})
          commentsToUpdate.comment=input
          commentsToUpdate.save()
          return commentsToUpdate
     },
   },
     
     Comment:{
           postsId:async ({postsId}, args, {models:{postsModel}},info)=>{
              console.log(`this is comments ${postsId}`)
            const posts =await postsModel.findById({_id:postsId}).exec()
            console.log(posts)
           return posts
        }
     }



}