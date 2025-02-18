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

        // >2 members
        if (!members || members.length < 2) {
            return res.status(400).json({ error: "A chatroom must have at least two members." });
        }

        console.log(members);

        // find by user not ID
        const users = await User.find({ username: { $in: members } });

        console.log(users);

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
            .populate("members", "username")
            .populate("messages.sender", "username")
            .exec();

        if (!chatroom) {
            return res.status(404).json({ error: "Chatroom not found" });
        }

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

        chatroom.messages.push({ sender, content });
        console.log(chatroom)
        console.log(sender)
        console.log(content)
        await chatroom.save();
        res.json(chatroom);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
});

module.exports = router;