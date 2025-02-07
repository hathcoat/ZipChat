const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    first_name: {type: String, required: false},
    last_name: {type: String, required: false},
});

module.exports = mongoose.model("User", UserSchema)
