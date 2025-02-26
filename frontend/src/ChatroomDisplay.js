import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatroom } from "./GetChatroom.js";
import { getUserId } from "./GetUserId.js";
import ChatInterface from "./ChatInterface";
import Avatar from "./Avatar";

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

    /*
    const handleNewMessage = (newMessage) => {
        setChatroom((prevChatroom) => ({
            ...prevChatroom,
            messages: [...prevChatroom.messages, newMessage]
        }));
    };
*/
    if (!chatroom || !chatroom.messages || !chatroom.members)
        return (<p>Loading chatroom...</p>);

    //Added
    {chatroom.messages.map((msg) => {
        const sender = msg.sender 
            ? chatroom.members.find((user) => user._id === msg.sender._id)
            : null;

        return (
            <div key={msg._id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                {sender ? (
                    <Avatar 
                        firstname={sender.first_name || ""}
                        lastname={sender.last_name || ""}
                        color={sender.avatarColor || "#3498db"} 
                        size={40} 
                    />
                ) : (
                    <div style={{ width: "40px", height: "40px", backgroundColor: "#ccc", borderRadius: "50%" }} />
                )}
                <p style={{ marginLeft: "10px" }}>
                    <strong>{sender ? sender.username : "Unknown User"}:</strong> {msg.content}
                </p>
            </div>
        );
    })}

    return (
        <div>
            <h2>{chatroom.name}</h2>
            <h3>Members:</h3>
            <ul>
                {chatroom.members.map((user) => (
                    <li key={user._id} style ={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <Avatar firstname={user.first_name || ""} lastname={user.last_name || ""} color={user.avatarColor || "#3498db"} size={40} />
                        {user.username}
                    </li>
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
}
export default ChatroomDisplay;