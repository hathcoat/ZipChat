import React, {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
            username,
            password
        });
        setMessage("Registration Successful! You can now login.");
    } catch(error) {
        console.error(error);
        setMessage("Registration failed. Try a different username.");
    }
};

return (
    <div>
        <h2>Register</h2>
        <nav style={{marginBottom: "20px"}}>
            <Link to="/login">Login</Link> |
            <Link to="/register">Register</Link>
        </nav>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
);
}

export default Register;