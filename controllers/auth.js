import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;

    // Validate user input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    // Validate email address format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address format." });
    }

    // Check for existing user with same email
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "Password must be at least 8 characters long and contain uppercase letters, numbers, and special characters." });
    }

    // Generate a salt for hashing the password
    const salt = await bcrypt.genSalt();
    // Hash the password with the generated salt
    const passwordHash = await bcrypt.hash(password, salt);

    // Create a new user object
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: picturePath || "", // Default to an empty string if picturePath is not provided
      friends: friends || [], // Default to an empty array if friends are not provided
      location: location || "", // Default to an empty string if location is not provided
      occupation: occupation || "", // Default to an empty string if occupation is not provided
      viewedProfile: Math.floor(Math.random() * 10000), // Assign a random number for viewedProfile
      impressions: Math.floor(Math.random() * 10000), // Assign a random number for impressions
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Return a 201 status with the saved user object
  } catch (err) {
    console.error("Registration error:", err.message); // Log the error message
    res.status(500).json({ error: "Failed to create user. Please try again." }); // Return a 500 status with an error message
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    // Validate email address format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address format." });
    }

    // Find a user with the provided email in the database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist." });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Generate a JWT token with the user's id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Remove the password field from the user object before sending it in the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ token, user: userWithoutPassword }); // Return a 200 status with the token and user object
  } catch (err) {
    console.error("Login error:", err.message); // Log the error message
    res.status(500).json({ error: "Failed to login. Please try again." }); // Return a 500 status with an error message
  }
};
