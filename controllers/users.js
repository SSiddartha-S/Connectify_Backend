// server/controllers/users.js
import mongoose from 'mongoose';
import User from '../models/User.js';

// READ - Get User
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// READ - Get User's Friends
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    const formattedFriends = friends
      .filter((friend) => friend) // Filter out any null values
      .map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      }));

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error('Error fetching user\'s friends:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE - Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, location, occupation, twitterHandle, linkedinHandle } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.location = location || user.location;
    user.occupation = occupation || user.occupation;
    user.twitterHandle = twitterHandle || user.twitterHandle;
    user.linkedinHandle = linkedinHandle || user.linkedinHandle;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE - Add or Remove Friend
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: 'Invalid User or Friend ID' });
    }
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!friend) return res.status(404).json({ message: 'Friend not found' });

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((fid) => fid.toString() !== friendId);
      friend.friends = friend.friends.filter((fid) => fid.toString() !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((fid) => User.findById(fid))
    );

    const formattedFriends = friends
      .filter((friend) => friend) // Filter out any null values
      .map(({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      }));

    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error('Error adding/removing friend:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
