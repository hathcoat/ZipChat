import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Name() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [selectedColor,setSelectedColor] = useState("#3498db");
    const navigate = useNavigate();
    const colorOptions = ["#3498db", "#FF6347", "#32CD32", "#FFD700", "#FF69B4", "#8A2BE2"];

    useEffect(() => {
        const storedFirstName = localStorage.getItem("first_name") || "";
        const storedLastName = localStorage.getItem("last_name") || "";
        const storedColor = localStorage.getItem("avatarColor") || "#3498db";

        setFirstName(storedFirstName);
        setLastName(storedLastName);
        setSelectedColor(storedColor);
    }, []);

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

                <div>
                    <label>Select Avatar Color:</label>
                    <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                        {colorOptions.map((color) => (
                            <div
                                key={color}
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