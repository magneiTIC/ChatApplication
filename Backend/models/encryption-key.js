const mongoose = require('mongoose');

const encryptionKeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    unique: true
  },
  privateKey: {
    type: String, 
    required: true,
  },
  publicKey: {
    type: String, 
    required: true,
  },
}, { collection: "EncryptionKey" });


module.exports = mongoose.model('EncryptionKey', encryptionKeySchema);
