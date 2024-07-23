import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,  // Path to image
    clipPath: String,     // Path to clip file
    attachmentPath: String, // Path to attachment file
    audioPath: String,    // Path to audio file
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: { // Fixed typo from 'Comments' to 'comments'
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
