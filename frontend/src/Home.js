import React, { useState, useEffect} from "react";
import axios from "axios";
import Chatrooms from "./Chatrooms";
import ChatInterface from "./ChatInterface";
import ChatroomList from "./ChatroomList";
import MakeChatroom from "./MakeChatroom";
import{useNavigate} from "react-router-dom";
import Avatar from "./Avatar.js"
import Name from "./Name";

function Home(){
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false)

    const username = localStorage.getItem("username"); //This gets the username from local storage
    const currentUser = {
        first_name: localStorage.getItem("first_name") || "",
        last_name: localStorage.getItem("last_name") || "",
        avatarColor: localStorage.getItem("avatarColor") || "#3498db",
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("first_name")
        localStorage.removeItem("last_name")
        localStorage.removeItem("avatarColor")

        navigate("/login");
    };

    const handleProfile = () => {
        navigate("/Name")
    }

    const ProfileButton = ({handleProfile}) => {
        return(
           <button onClick={handleProfile} style={styles.profileContainer}>
                Profile
            </button>
        )
    }
    const styles = {
        buttonContainer: {
            position: "fixed",
            top: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px", // Adds space between the profile and logout buttons
        },

        profileContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            overflow: "hidden",
            transition: "box-shadow 0.3s ease",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },

        logoutButton: {
            padding: "10px 15px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
        },
    };

    return(
        <div>
            <h1>Welcome to the Home Page!</h1>

        {/*
            <button onClick={handleProfile} style={styles.profileContainer}>Profile</button>
            <button onClick={handleLogout} style={styles.logoutButton}>Sign Out</button>
        */}
        <div style={styles.buttonContainer}>
            {/* Profile Button (to the left of Sign Out) */}
            <ProfileButton handleProfile={handleProfile} />

            {/* Sign Out Button */}
            <button onClick={handleLogout} style={styles.logoutButton}>
                Sign Out
            </button>
        </div>
            <MakeChatroom />
            <Chatrooms refresh = {refresh} />
            <ChatroomList setRefresh={setRefresh}/>
            <ChatInterface chatroomId ="67b6c68d4ddd37cc0ac78bf5" senderId="67a465bd61aa98bf1b7a9550" />
           {/*<ChatInterface chatroomId ="67ab0df06885894618b2c8dd" senderId="67a53bb98d5e40d59e13c2e7" />*/}
        </div>
    );
};

export default Home;