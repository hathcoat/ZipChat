const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {connectDB} = require("./db");

dotenv.config(); //Load environment variables.

const app = express();

//Parse JSON bodies
app.use(express.json());
//Enable CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//Connect to mongo db
connectDB();
//Authentication routes.
app.use("/api/auth", require("./auth"));
//Chatroom routes
app.use("/api/chatrooms", require("./chatroomRoutes"))

const chatroomRoutes = require("./chatroomRoutes");
//app.use("/chatrooms", chatroomRoutes);


/*
mongoose.connect(Mongo_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));
*/
//Set default port from .env to 5000
const PORT = process.env.PORT || 5000;

let server;
if(require.main === module){
    server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
/*
//Only start if file is run directly.
if(require.main === module){
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
*/
//Export app for testing.
//module.exports = app;
module.exports = {app, server};
