const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    user: {
      type: String, 
      required: true,
    },
    content: {
      type: String, 
      required: true,
    },
    sentAt: {
      type: Date, 
      default: Date.now, // The default date is the current date and time
    },
  });
  
  // Create a Mongoose model based on the schema
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;