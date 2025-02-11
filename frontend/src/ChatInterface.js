import {useState} from "react";
import {sendMessage} from "./SendMessage"

const ChatInterface = ({chatroomId, senderId}) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(chatroomId, senderId, message);
            setMessage("")
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