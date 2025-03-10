import React from "react";
import {useState} from "react";
import {sendMessage} from "./SendMessage";

const ChatInterface = ({chatroomId, senderId, onMessageSent}) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSend = async () => {
        if (message.trim()) {
            try {
                const newMessage = await sendMessage(chatroomId, senderId, message);
                setMessage("");
                setError("");
    
                if (newMessage && typeof onMessageSent === "function") {
                    onMessageSent(newMessage);
                }
            } catch (err) {
                setError("Failed to send message");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default ChatInterface