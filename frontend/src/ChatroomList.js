import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChatrooms } from "./GetChatrooms";
import Chatrooms from "./Chatrooms";

const ChatroomList = ({setRefresh}) => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    fetchChatrooms();
    const interval = setInterval(fetchChatrooms, 500);
    return () => clearInterval(interval);
  }, []);

  const deleteChatroom = async(chatroomId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chatroom?");
    if(!confirmDelete) return;

    console.log("Deleting chatroom with ID:", chatroomId);
    try{
      const response = await fetch(`http://localhost:5000/api/chatrooms/${chatroomId}`, {
        method: "DELETE",
      });

      if(!response.ok){
        throw new Error("Failed to delete chatroom");
      }
      setChatrooms((prevChatrooms) => prevChatrooms.filter((chatroom) => chatroom._id !== chatroomId));
      setRefresh(prev => !prev);
      //fetchChatrooms();
      
    } catch(error){
        console.error("Error deleting chatroom:", error);
    }
  }
/*
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
*/
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

              <button
                onClick={() => deleteChatroom(room._id)}
                style={styles.deleteButton}
              >Delete</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  deleteButton: {
    background: "#d32f2f", 
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default ChatroomList;
