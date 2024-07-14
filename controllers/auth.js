 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken";
 import User from "../models/User.js";

// register user
export const register = async (req, res) => {
    //register an asynchronous function that uses request and response
    // here we are requesting the body from the server using(req)
    // and the server send response back to us using(res)
    // it returns 201 if saved body else 500 if any error occurs
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation

        } = req.body;
        //requesting all variables body

    //     // Validate user input
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Please fill in all required fields" });
      }

        const salt = await bcrypt.genSalt();
        // bcrypt and salt used to secure password
        const passwordHash = await bcrypt.hash(password,salt);
        //creating new user document
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)

        });
        const savedUser = await newUser.save();
        //saves the data of new user
        res.status(201).json(savedUser);
        // if data is saved json returns 201 status code is given


    } catch (err) {
        res.status(500).json({error: err.message});
        //if any error occurs it returns 500 status code


    }
};


// Logging in
export const login = async(req,res)=> {
    // here login is a asynchronous function wit login that has 2 func req,res
    try {
        const { email, password}=req.body;
        // for taking email and pass from body
        const user = await User.findOne({email: email});
        //  here user waits till it get the matching email

        if (!user) return res.status(400).json({msg: "User does not exist. "});

        if (user) {
            user.lastLogin = Date.now();
            await user.save();
          }

        const isMatch = await bcrypt.compare(password,user.password);
        //comparing pass
        if(!isMatch) return res.status(400).json({msg: "Invalid user credentials."});

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
    //  here json web token(JWT) generates a secret code in .env file
        delete user.password;
        //  here the pass is removed as it should not be sent to response
        res.status(200).json({token,user});
        //  here JWT and user are returned

    } catch(err) {
        res.status(500).json({error: err.message});
    }
}