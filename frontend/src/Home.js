import React from "react";
import Chatrooms from "./Chatrooms"
import ChatInterface from "./ChatInterface"
import ChatroomList from "./ChatroomList"
import MakeChatroom from "./MakeChatroom";

function Home(){
    return(
        <div>
            <h1>Welcome to the Home Page!</h1>
            <MakeChatroom />
            <Chatrooms />
            <ChatroomList />
            <ChatInterface chatroomId ="67ab0df06885894618b2c8dd" senderId="67a53bb98d5e40d59e13c2e7" />
        </div>
    )
}

export default Home;