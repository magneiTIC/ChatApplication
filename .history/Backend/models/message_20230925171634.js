const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    firstId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      secondId: {
        type: Schema.Types.ObjectId,
        required: true
      },
      firstUserName: {
        type: String,
        required: true
      },
      secondUserName: {
        type: String,
        required: true
      },
      
}, { collection: "messages" });

module.exports = mongoose.model("messages", messageSchema);