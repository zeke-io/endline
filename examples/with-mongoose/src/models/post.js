import mongoose, { Schema } from 'mongoose'

const PostSchema = new Schema({
  title: {
    type: 'string',
    required: true,
  },
  content: {
    type: 'string',
    required: true,
  },
})

const Post = mongoose.model('Post', PostSchema)

export default Post
