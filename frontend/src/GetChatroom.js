import axios from "axios";

export const getChatroom = async (chatroomId) => {
  try {
    const res = await fetch(`http://localhost:5000/api/chatrooms/${chatroomId}`);
    const data = await res.json();
    console.log("Chatroom Data from Backend:", JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.error("Error fetching chatroom:", err.response?.data || err.message);
  }
};

export default getChatroom