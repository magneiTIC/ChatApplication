const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    user: {
        type: String, // The name of the user who sent the message
        required: true,
      },
      content: {
        type: String, // The content of the message
        required: true,
      },
      sentAt: {
        type: Date, // The date and time when the message was sent
        default: Date.now, // The default date is the current date and time
      },
    });

}, { collection: "messages" });

module.exports = mongoose.model("messages", messageSchema);