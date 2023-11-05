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
      ref: 'Messages'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  autorised:
  {
    type: Boolean,
    default: true
  },
  sharedKey: 
    {
      type: String,
      required: true,
      unique: true
    }
},
  //{ timestamps: true },
  { collection: "Chats" }
);


module.exports = mongoose.model('Chats', chatSchema);