import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChatrooms } from "./GetChatrooms";

const ChatroomList = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const data = await getChatrooms();
        setChatrooms(data || []);
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();
  }, []);

  if (loading) return <p>Loading chatrooms...</p>;

  return (
    <div>
      <h2>Available Chatrooms</h2>
      {chatrooms.length === 0 ? (
        <p>No chatrooms available.</p>
      ) : (
        <ul>
          {chatrooms.map((room) => (
            <li key={room._id}>
              <Link to={`/chatroom/${room._id}`}>{room.name}</Link>
              <p>Members: {room.members.map(p => p.username).join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatroomList;
