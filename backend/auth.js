//Maps URL paths to right controller foos.

const express = require("express");
const router = express.Router();
const {login} = require("./authController");
const bcrypt = require("bcryptjs");
const User = require("./User")
const jwt = require('jsonwebtoken')
require('dotenv').config();

//Call the login foo.
//router.post("/login", login);
router.post("/login", async(req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(!user || !await bcrypt.compare(password, user.password)){
        return res.status(400).json({message: "Invalid crednetials"});
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    const redirect = !user.first_name || !user.last_name;

    res.json({token, redirect});
    
})

router.post("/register", async(req, res) => {
    try{
        const{username, password, first_name, last_name} = req.body;
        console.log(`Attempting to register user: ${username}`);

        //Check if user already exists.
        const existingUser = await User.findOne({username});
        if(existingUser){
            console.log(`User already exists: ${username}`)
            return res.status(400).json({message: "User already taken."})
        }
        //Hash password for security.
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`User registered with username: ${username}`);
        //Create new user instance
        const newUserData = new User({username, password: hashedPassword});
        if(first_name && last_name) {
            newUserData.first_name = first_name;
            newUserData.last_name = last_name;
        }
        const newUser = new User(newUserData);
        //Save user in data base.
        await newUser.save();

        if(!first_name || !last_name) {
            res.status(201).json({message: "User registered successfully, please add your name.", redirect: "/name"});
        } else {
        res.status(201).json({message: "User registered successfully."});
        }

    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
});

router.post("/setname", async (req, res) => {
    const {first_name, last_name, avatarColor} = req.body;

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if(!token){
            return res.status(401).json({message: 'No token, authorization denied'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(404).json({message:"User not found."})
        }
        user.first_name = first_name;
        user.last_name = last_name;
        user.avatarColor = avatarColor;
        await user.save();

        res.status(200).json({message: "Name updated successfully.", redirect: true});
    } catch(error) {
        console.error(error);
        res.status(500).json({message: "Server error.", redirect: false});
    }
});

//Get username
router.get("/:username", async (req, res) => {
    try{
        const user = await User.findOne({username: req.params.username});

        if(!user){
            return res.status(404).json({error: "User not found."});
        }
        res.json({id: user._id, username: user.username});
    } catch(err){
        console.error("Error fetching user:", err);
        res.status(500).json({error: "Server error"});
    }
});

//Update avatar color
router.put("/avatar", async(req, res) => {
    const {userId, avatarColor} = req.body;

    try{
        //Update teh color
        const user = await User.findByIdAndUpdate(
            userId,
            {avatarColor},
            {new: true}
        );

        //User not found.
        if(!user) return res.status(404).json({message: "User not found"});

        res.status(200).json(user);
    } catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;