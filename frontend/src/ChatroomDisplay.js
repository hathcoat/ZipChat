import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatroom } from "./GetChatroom.js";
import ChatInterface from "./ChatInterface";

const ChatroomDisplay = () => {
    const { chatroomId } = useParams();
    const [chatroom, setChatroom] = useState(null);

    //Gets chatroom info and fills box
    const fetchChatroom = async () => {
        const data = await getChatroom(chatroomId);
        setChatroom(data);
    };

    //Fetches chatroom repeatedly to update it
    useEffect(() => {
        fetchChatroom();
        const interval = setInterval(fetchChatroom, 500); //Interval of 500ms
        return () => clearInterval(interval);
    }, [chatroomId]);

    if (!chatroom)
        return (<p>Loading chatroom...</p>);

    return (
        <div>
            <h2>{chatroom.name}</h2>
            <h3>Members:</h3>
            <ul>
                {chatroom.members.map((user) => (
                    <li key={user._id}>{user.username}</li>
                ))}
            </ul>

            <h3>Messages:</h3>
            <div style={{ border: "1px solid black", padding: "10px", maxWidth: "400px" }}>
                {chatroom.messages.length > 0 ? (
                    chatroom.messages.map((msg) => (
                        <p key={msg._id}>
                            <strong>{msg.sender.username}:</strong> {msg.content}
                        </p>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>

            <br></br>
            <ChatInterface chatroomId = {chatroomId} senderId="67a53bb98d5e40d59e13c2e7" />

        </div>
    );
};

export default ChatroomDisplay;