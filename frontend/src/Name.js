import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Name() {
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/auth/setname", {
                first_name,
                last_name,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log("Response from setname:", response.data);
            if(response.data.redirect){
                navigate("/home");
            }
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Set Your Name</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default Name;