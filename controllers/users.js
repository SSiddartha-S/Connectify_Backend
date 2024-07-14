import User from "../models/User.js";


//   READ 


export const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const user = await User.findById(id); // Find the user by ID
    res.status(200).json(user); // Return user data with 200 status
  } catch (err) {
    res.status(404).json({ message: err.message }); // Handle errors by returning 404 status
  }
};


export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const user = await User.findById(id); // Find the user by ID

    // Fetch all friends based on their IDs stored in the user document
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    // Format the friends' data to include only necessary fields
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends); // Return formatted friends data with 200 status
  } catch (err) {
    res.status(404).json({ message: err.message }); // Handle errors by returning 404 status
  }
};


//   UPDATE 

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params; // Extract user ID and friend ID from request parameters
    const user = await User.findById(id); // Find the user by ID
    const friend = await User.findById(friendId); // Find the friend by friend ID

    // Check if the friend is already in the user's friends list
    if (user.friends.includes(friendId)) {
      // If they are friends, remove them from the friends list
      user.friends = user.friends.filter((fid) => fid !== friendId);
      friend.friends = friend.friends.filter((fid) => fid !== id);
    } else {
      // If they are not friends, add them to the friends list
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    
    // Save the updated user and friend documents to the database
    await user.save();
    await friend.save();

    // Fetch and format the updated friends list
    const friends = await Promise.all(
      user.friends.map((fid) => User.findById(fid))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends); // Return updated friends list with 200 status
  } catch (err) {
    res.status(404).json({ message: err.message }); // Handle errors by returning 404 status
  }
};
