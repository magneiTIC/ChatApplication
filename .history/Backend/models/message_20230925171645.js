const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    

}, { collection: "messages" });

module.exports = mongoose.model("messages", messageSchema);