//Login form and sending login request to backend
import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
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
            //Save the token for other authenticated requests
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);

            if (redirect) {
                navigate("/name");
            } else {
                setIsLoggedIn(true);
                setMessage("Login successful!");
                navigate("/home");
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
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="Submit">Login</button>
            </form>
        </div>

    );
}

export default Login;