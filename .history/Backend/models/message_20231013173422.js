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
    
  },
  { collection: "Messages" });
  // Personnalisez la méthode toObject pour remplacer objectId par uid
// messageSchema.set('toObject', {
//   transform: function (doc, ret) {
//     ret.user = ret.user.uid; // Utilisez l'attribut uid à la place de objectId
//     delete ret._id; // Supprimez _id
//     delete ret.__v; // Supprimez __v
//   },
// });

  
  module.exports = mongoose.model('Messages', messageSchema);