import React, {useState, useEffect} from "react";
import axios from "axios";

const Chatrooms = () => {
    const [chatrooms, setChatrooms] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/chatrooms")
        .then(res => setChatrooms(res.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Chatrooms</h2>
            <ul>
                {chatrooms.map(chat => (
                    <li key = {chat._id}>{chat.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chatrooms;

