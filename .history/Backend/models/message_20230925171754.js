const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: {
      type: String, 
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
  
  // Create a Mongoose model based on the schema
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;