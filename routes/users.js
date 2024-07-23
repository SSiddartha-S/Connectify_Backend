import express from 'express';
import { getUser, getUserFriends, addRemoveFriend, updateUser } from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Route to get a user by their ID. Requires token verification.
router.get('/:id', verifyToken, getUser);

// Route to get a user's friends by user ID. Requires token verification.
router.get('/:id/friends', verifyToken, getUserFriends);

// Route to add or remove a friend from a user's friend list. Requires token verification.
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

// Route to update user information. Requires token verification.
router.patch('/update/:id', verifyToken, updateUser);

export default router;
