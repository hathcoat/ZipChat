import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Name() {
    const navigate = useNavigate();
    const colorOptions = ["#3498db", "#FF6347", "#32CD32", "#FFD700", "#FF69B4", "#8A2BE2"];

    const username = localStorage.getItem("username");

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#3498db")

    useEffect(() => {
        const fetchUserData = async() => {
            try{
                const response = await axios.get(`http://localhost:5000/api/auth/user/${username}`);
                const {first_name, last_name, avatarColor} = response.data;
                console.log("User Data recieved:", response.data);

                setFirstName(first_name || "");
                setLastName(last_name || "");
                setSelectedColor(avatarColor|| "#3498db");

                localStorage.setItem("first_name", first_name);
                localStorage.setItem("last_name", last_name);
                localStorage.setItem("avatarColor", avatarColor);
            } catch (error){
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/auth/setname", {
                first_name,
                last_name,
                avatarColor: selectedColor,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name);
            localStorage.setItem("avatarColor", selectedColor);

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
            <h2>Set Your Name & Avatar Color</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name">First Name:</label>
                    <input
                        id="first_name"
                        type="text"
                        value={first_name}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFirstName(value.slice(0, 30));
                        }}
                        required
                        maxLength={30}
                        />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        id="last_name"
                        type="text"
                        value={last_name}
                        onChange={(e) => {
                            const value = e.target.value;
                            setLastName(value.slice(0, 30));
                        }}
                        required
                        maxLength={30}
                    />
                </div>

                <div>
                    <label>Select Avatar Color:</label>
                    <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                        {colorOptions.map((color) => (
                            <div
                                key={color}
                                data-testid="avatar-color-option"
                                onClick= {() => setSelectedColor(color)}
                                style={{
                                    backgroundColor: color,
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    border: selectedColor ===color ? "3px solid black" : "1px solid gray",
                                }}
                            />
                        ))}
                    </div>
                    <p>Selected Color:</p>
                    <div
                        style={{
                            backgroundColor: selectedColor,
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "2px solid #000",
                        }}
                    />
                </div>
                <button type="submit" style = {{marginTop: "20px"}}>Save</button>
            </form>
        </div>
    );
}

export default Name;