import axios from "axios";

export const sendMessage = async (chatroomId, senderId, content) => {
    try {
        await axios.post(`http://localhost:5000/api/chatrooms/${chatroomId}/message`, {
            sender: senderId,
            content
        });
        
    } catch (err) {
        console.error(err);
    }
};