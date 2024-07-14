import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName:{
            type: String,
            required: true,
        },
        lastName: {
            type:String,
            required: true,
        } ,
        location: String,
        description:String,
        picturePath: String,
        userPicturePath: String,
        likes: {
            type: Map,

            of: Boolean,
        },
        Comments:{
            type: Array,
            default:[]
        }

    },
    {timestamps: true}
);

const Post = mongoose.model("Post",postSchema);
//  we created Post using mongoose.model named as Post with postSchema

export default Post;
