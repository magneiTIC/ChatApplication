const mongoose = require("mongoose");
const User= require

const messageSchema = new mongoose.Schema({
    
    user: {
      type: String, 
      required: true,
      ref: User
    },
    content: {
      type: String, 
      required: true,
    },
    sentAt: {
      type: Date, 
      default: Date.now, 
    },
  });
  
  // Create a Mongoose model based on the schema
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;