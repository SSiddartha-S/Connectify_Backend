import User from "../models/User.js";


export const getUser = async(req,res) => {
    //  getUser to retrive user by id
    try {
        const {id } = req.params;
        // it requests id parameters ti find a user in User model
        const user = await User.findById(id);
        // if user is found it returns response 200
        res.status(200).json(user);

    } catch(err) {
        res.start(404).json({message: err.message});
    }
}

export const getUserFriends = async(req,res) => {
    // it used to retrieve users friends  id
   try {
    const {id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
        //  here promise helps to give all user friends 
        user.friends.map((id) => User.findById(id))
        
    );
    const formattedFriends = friends.map(
        //  here formattedFriends are the list of friends with
        //  some specific fields from friends
        ({ _id, firstName, lastName, occupation, location, picturePath }) =>{
            return{ _id, firstName, lastName, occupation, location,picturePath};
        }
        );
        res.status(200).json(formattedFriends);
    
   } catch  (err){
    res.start(404).json({message:err.message});
   }

}


export const addRemoveFriend = async(req,res) => {
    try {
        const { id , friendId }  = req.params;
        //  here id and friend id are req
        const user = await User.findById(id);
        //  finding users
        const friend = await User.findById(friendId);
        //  finding friends id
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            //  this one gives all ids which are not friendids in new array, it removes the ids if == friendid from new array
           

        }
        else {
             user.friends.push(friendId);
            //  it adds friendid to user friends array
            friend.friends.push(id);
            //  this adds user id to friends friend array
        }
        await user.save();
        // here updated info is saved to database
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) =>{
                return{ _id, firstName, lastName, occupation, location,picturePath};
            }
            );
            res.status(200).json(formattedFriends);

    } catch  (err){
        res.start(404).json({message:err.message});
       }
    
}
