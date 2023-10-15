const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  users: [
    {,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
    type: Boolean,
    default:true
  }
},
  //{ timestamps: true },
  { collection: "Chats" }
);

chatSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.user = ret.user.uid; // Utilisez l'attribut uid à la place de objectId
    delete ret._id; // Supprimez _id
    delete ret.__v; // Supprimez __v
  },
});

module.exports = mongoose.model('Chats', chatSchema);