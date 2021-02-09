import mongoose from 'mongoose'

const commentsSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true
    },
    postsId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'post'
    }
})


export default mongoose.models.comment || mongoose.model('comment', commentsSchema); 