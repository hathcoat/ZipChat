import React from "react";
import {useState} from "react";
import {sendMessage} from "./SendMessage";

const ChatInterface = ({chatroomId, senderId, onMessageSent}) => {
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (message.trim()) {
            const newMessage = await sendMessage(chatroomId, senderId, message);
            setMessage("")

            if(newMessage && typeof onMessageSent === "function") {
                onMessageSent(newMessage); //Ensure UI updates instantly
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