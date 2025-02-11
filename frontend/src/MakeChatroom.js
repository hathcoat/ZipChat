import { useState } from "react";
import { createChatroom } from "./CreateChatroom.js";

const MakeChatroom = () => {
  const [name, setName] = useState("");
  const [usernames, setUsernames] = useState("");

  const handleCreate = async () => {
    const usernameArray = usernames.split(",").map(u => u.trim());
    await createChatroom(name, usernameArray);
    setName("");
    setUsernames("");
  };

  return (
    <div>
      <h2>Create a Chatroom</h2>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Chatroom Name"
      />
      <input 
        type="text" 
        value={usernames} 
        onChange={(e) => setUsernames(e.target.value)} 
        placeholder="Participant Usernames (comma separated)"
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
};

export default MakeChatroom;