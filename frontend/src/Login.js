//Login form and sending login request to backend
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function Login({setIsLoggedIn}) {
    console.log("Rending Login Component");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault(); //Prevent default form submission

        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                username, 
                password,
            });

            const{token, redirect} = response.data //extract token.

            if(token){ //Added this if statement
                //Save the token for other authenticated requests
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                setIsLoggedIn(true);
                setMessage("Login successful! Redirecting...");

                if (redirect) {
                    navigate("/name");
                } else {
                    //setIsLoggedIn(true);
                    //setMessage("Login successful!");
                    navigate("/home");
                }
            }
            
        } catch(error) {
            console.error(error);
            setMessage("Login failed. Please check your credentials.");
        }
    };

    return(
        <div>
            <h2>Login</h2>
            <nav style={{marginBottom: "20px"}}>
                <Link to="/login">Login</Link> |
                <Link to="/register">Register</Link>
            </nav>
            
            {/* Display a message if login fails or successeds */}
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input 
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                            const value = e.target.value;
                            setUsername(value.slice(0, 30));
                        }}
                        required
                        maxLength={30}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input 
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value.slice(0, 30));
                        }}
                        required
                        maxLength={30}
                    />
                </div>
                <button type="Submit">Login</button>
            </form>
        </div>

    );
}

export default Login;