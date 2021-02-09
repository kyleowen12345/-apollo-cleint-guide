import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  comments:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment',
  }],
});


export default mongoose.models.post || mongoose.model('post', postSchema);