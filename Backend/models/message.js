const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'video', 'audio', 'file', 'quote'],
  },
  content: String,
  media: {
    data: Buffer,
    contentType: String,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['unread', 'sent', 'received', 'read'], 
    default: 'unread'
  }
}, { collection: "Messages" });

module.exports = mongoose.model('Messages', messageSchema);
