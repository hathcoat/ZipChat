import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatroom } from "./GetChatroom.js";
import { ChatInterface } from "./ChatInterface.js"

const ChatroomDisplay = () => {
  const { chatroomId } = useParams();
  const [chatroom, setChatroom] = useState(null);

  useEffect(() => {
    const fetchChatroom = async () => {
      const data = await getChatroom(chatroomId);
      setChatroom(data);
    };

    fetchChatroom();
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
    </div>
  );
};

export default ChatroomDisplay;