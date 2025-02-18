import React, { useState } from "react";
import Chatrooms from "./Chatrooms"
import ChatInterface from "./ChatInterface"
import ChatroomList from "./ChatroomList"
import MakeChatroom from "./MakeChatroom";
import{useNavigate} from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/login");
    };

    return(
        <div>
            <h1>Welcome to the Home Page!</h1>
            <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
            <MakeChatroom />
            <Chatrooms refresh = {refresh} />
            <ChatroomList setRefresh={setRefresh}/>
            <ChatInterface chatroomId ="67ab0df06885894618b2c8dd" senderId="67a53bb98d5e40d59e13c2e7" />
        </div>
    );
};

const styles = {
    logoutButton: {
        position: "fixed", 
        top: "10px",
        right: "10px",
        padding: "10px 15px",
        background: "#ff4d4d",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    }
};

export default Home;