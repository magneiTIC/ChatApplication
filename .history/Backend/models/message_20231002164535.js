const mongoose = require("mongoose");
const User= require('./user')

const messageSchema = new mongoose.Schema({
    
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'User',
    },
    chat:{
      type: mongoose.Schema.
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