const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    messagename: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { collection: "messages" });

module.exports = mongoose.model("messages", messageSchema);