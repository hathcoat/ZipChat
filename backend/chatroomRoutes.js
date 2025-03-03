const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Chatroom = require('./Chatroom');
const User = require('./User');

router.get("/", async (req, res) => {
    try {
        const chatrooms = await Chatroom.find().populate("members", "username");
        res.json(chatrooms);
    } catch (err) {
        console.error("Error fetching chatrooms:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, members } = req.body;
        
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: "A chatroom must have a name." });
        }

        // req >=2 members
        if (!members || members.length < 2) {
            return res.status(400).json({ error: "A chatroom must have at least two members." });
        }

        // find by user not ID
        const users = await User.find({ username: { $in: members } });

        if (users.length !== members.length) {
            return res.status(400).json({ error: "Some usernames were not found." });
        }

        const userIds = users.map(user => user._id);

        const newChatroom = new Chatroom({ name, members: userIds });
        await newChatroom.save();

        res.status(201).json(newChatroom);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
});

router.get("/:chatroomId", async (req, res) => {
    try {
        const { chatroomId } = req.params;

        // populate users and messages
        const chatroom = await Chatroom.findById(chatroomId)
            .populate("members", "username first_name last_name avatarColor")
            .populate("messages.sender", "username first_name last_name avatarColor")
            .exec();

        if (!chatroom) {
            return res.status(404).json({ error: "Chatroom not found" });
        }


        ///added await
        await Chatroom.populate(chatroom,{
            path: "messages.sender",
            select: "username firstname lastname color"
        });

        res.json(chatroom);
    } catch (err) {
        console.error("Error fetching chatroom:", err);
        res.status(500).json({ error: err.message });
    }
});

// Send message in a chatroom
router.post('/:id/message', async (req, res) => {
    try {
        const { sender, content } = req.body;
        const chatroom = await Chatroom.findById(req.params.id);
        if (!chatroom) return res.status(404).json({ error: 'Chatroom not found' });

        //Added
        const user = await User.findById(sender);
        if(!user) return res.status(400).json({error:  "Invalid sender ID"});
        const newMessage = {sender: user._id, content};
        chatroom.messages.push(newMessage);
        await chatroom.save();
        await chatroom.populate("messages.sender", "username first_name last_name avatarColor");
        res.json(chatroom);

        /*
        chatroom.messages.push({ sender, content });
        console.log(chatroom)
        console.log(sender)
        console.log(content)
        await chatroom.save();
        res.json(chatroom);
        */
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
});

router.delete("/:id", async(req, res) => {
    try{
      const chatroomId = req.params.id; 
      // Convert string to ObjectId
      if (!mongoose.Types.ObjectId.isValid(chatroomId)) {
          console.error("Invalid ObjectId format:", chatroomId);
          return res.status(400).json({ message: "Invalid chatroom ID format." });
      }

      const deletedChatroom = await Chatroom.findByIdAndDelete(chatroomId);

      if(!deletedChatroom){
        return res.status(404).json({message: "Chatroom not found."});
      }
      res.json({message: "Chatroom deleted successfully"});
    } catch(error){
        console.error("Error deleting chatroom:", error);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;