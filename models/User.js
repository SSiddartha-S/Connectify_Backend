 import mongoose from "mongoose";

 // craeting structure of user details in mongodb 
 const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min:3,
            max:30,
        },
        lastName: {
            type: String,
            required: true,
            min:3,
            max:30,
        }, 
        email: {
            type: String,
            required: true,
            max:50,
            unique: true,
        }, 
        password: {
            type: String,
            require: true,
            min:6,
            
        }, 
        picture: {
            type: String,
            default:""

        }, 
        friends: {
            type: Array,
            default:[]
        },

        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,

    },
    {timestamps: true }
    // timestamp gives the fields od createdat and updatedat
 );

 const User = mongoose.model("User",UserSchema)
 //hereu we can create User based on the data give up in UserSchema
export default User;
//by eporting we can use it in other parts of application