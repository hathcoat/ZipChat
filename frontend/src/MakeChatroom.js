import React, { useState } from "react";
import { createChatroom } from "./CreateChatroom";

const MakeChatroom = () => {
    const [name, setName] = useState("");
    const [usernames, setUsernames] = useState("");
    const [message, setMessage] = useState("");


    const handleCreate = async () => {
        const usernameArray = usernames.split(",").map(u => u.trim());
        const username = localStorage.getItem("username")

        if (!usernameArray.includes(username)) {
            usernameArray.push(username);
        }

        try {
            await createChatroom(name, usernameArray);
            setMessage("Chatroom created successfully!");
            setName("");
            setUsernames("");
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to create chatroom. Please try again.");
        }
    };

    return (
        <div>
            <h2>Create a Chatroom</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Room Name (required)"
                style={{ width: "300px" }}
            />
            <br></br>
            <input
                type="text"
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
                placeholder="Usernames (comma separated)"
                style={{ width: "300px" }}
            />
            <br></br>
            <button onClick={handleCreate}>Create</button>
            <br></br>
            {message && <p>{message}</p>}
        </div>
    );
};

export default MakeChatroom;