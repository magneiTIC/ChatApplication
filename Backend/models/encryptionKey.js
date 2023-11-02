const mongoose=require("mongoose")
const encryptionKeySchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    keyType: {
        type: String,
        enum: ['preKey', 'signedPreKey'],
        required: true,
      },
      keyId: {
        type: Number, // Un identifiant unique pour chaque clé
        required: true,
      },
      publicKey: {
        type: String,
        required: true,
      },
      signature: {
        type: String, // La signature associée à la clé signée (utilisé pour les clés signées de pré-échange)
      },
  }, { collection: "EncryptionKey" });
  
  module.exports = mongoose.model('EncryptionKey', encryptionKeySchema);
