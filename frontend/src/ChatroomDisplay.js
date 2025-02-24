import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatroom } from "./GetChatroom.js";
import { getUserId } from "./GetUserId.js";
import ChatInterface from "./ChatInterface";

const ChatroomDisplay = () => {
    const { chatroomId } = useParams();
    const [chatroom, setChatroom] = useState(null);
    const [userId, setUserId] = useState(null);

    //Gets chatroom info and fills box
    const fetchChatroom = async () => {
        const data = await getChatroom(chatroomId);
        setChatroom(data);
    };

    //Retrieves user ID
    const fetchUserId = async () => {
        const id = await getUserId();
        setUserId(id);
    };

    //UID
    useEffect(() => {
        fetchUserId();
    }, []);

    //Fetches chatroom repeatedly to update it
    useEffect(() => {
        fetchChatroom();
        const interval = setInterval(fetchChatroom, 200);
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
                        <div key={msg._id} style={{ marginBottom: "10px" }}>
                            <p style={{ fontSize: "10pt", margin: "1px 0" }}>
                                {<strong>{msg.sender.username}</strong>}: {msg.content}
                            </p>
                            <p style={{ fontSize: "6pt", margin: 0 }}>
                                {new Date(msg.timestamp).toLocaleTimeString()} {new Date(msg.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>

            <br></br>
            <ChatInterface chatroomId={chatroomId} senderId={userId} />

        </div>
    );
};

export default ChatroomDisplay;