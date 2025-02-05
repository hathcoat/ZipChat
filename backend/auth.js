//Maps URL paths to right controller foos.

const express = require("express");
const router = express.Router();
const {login} = require("./authController");
const bcrypt = require("bcryptjs");
const User = require("./User")

//Call the login foo.
router.post("/login", login);

router.post("/register", async(req, res) => {
    try{
        const{username, password} = req.body;
        console.log(`Attempting to register user: ${username}`);

        const existingUser = await User.findOne({username});
        if(existingUser){
            console.log(`User already exists: ${username}`)
            return res.status(400).json({message: "User already taken."})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`User registered with username: ${username}`);
        const newUser = new User({username, password: hashedPassword});
        await newUser.save();

        res.status(201).json({message: "User registered successfully."});
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;