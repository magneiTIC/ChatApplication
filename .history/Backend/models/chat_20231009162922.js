const mongoose = require('mongoose')
const chatSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Message'
    } 
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  autorised:
  {
    type: Boolean
  }
},
  { timestamps: true },
  { collection: "Users" }
);

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;