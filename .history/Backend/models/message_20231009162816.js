const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'User',
    },
    chat:{
      type: mongoose.Schema.ObjectId,
      ref: 'Chat'
    },
    content: {
      type: String, 
      required: true,
    },
    sentAt: {
      type: Date, 
      default: Date.now, 
    },
    
  }
  );
  
  
  const Message = mongoose.model('Message', messageSchema);
  
  module.exports = Message;