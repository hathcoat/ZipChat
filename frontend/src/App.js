import React, {useState, useEffect} from "react";
import{BrowserRouter as Router, Routes, Route, useAsyncError} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Name from "./Name";
import {Link} from "react-router-dom";

function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            try{
                const payload = JSON.parse(atob(token.split(".")[1])); //Decode JWT payload
                const isExpired = payload.exp * 1000 < Date.now(); //Convert exp to milliseconds
                if(isExpired){
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                } else {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Invalid token format:", error);
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);
    if (loading){
        return <div>Loading...</div>
    }

    return(
        <Router>
            <div className="App">
                <h1>ZipChat</h1>
                <Routes>
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
                    <Route path="/register" element={<Register />}/>
                    <Route path="/home" element={<Home />}/>
                    <Route path="/name" element={<Name />}/>
                    <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
