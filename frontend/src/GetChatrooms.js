import axios from "axios";

export const getChatrooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chatrooms");
      return res.data;
    } catch (err) {
      console.error("Error fetching chatrooms:", err.response?.data || err.message);
    }
  };  