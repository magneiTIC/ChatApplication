const Message = require('../models/message');
const Chat = require('../models/chat')
const User = require('../models/user')
const mongoose=require('mongoose')
const { decryptMessage, decryptPrivateKey } = require('../config/generate-key')
const encryptionKey = process.env.ENCRYPTION_KEY;
const ivKey = process.env.IV_KEY;
module.exports = {
  //Création d'un nouveau message
  // async createMessage(req,res){
  //   try {
  //     const { user, content, chatId } = req.body;
  //     const newMessage = new Message({
  //       user,
  //       content,
  //       chat: chatId,
  //     });

  //     await newMessage.save();

  //     res.status(201).json(newMessage);

  //   } 
  //   catch (error) {
  //     console.log("erreur lors de la création d'un message", error );
  //     res.status(501).json({ error: 'Erreur lors de la création du message' });
  //   }
  // },

  //Liste des messages d'une conversation 
  // async getMessagesByChat(req, res) {
  //   try {
  //     const chatId = req.params.chatId;
  //     const messages = await Message.find({ chat: chatId })
  //       .sort({ sentAt: 'asc' })
  //       .populate('user', 'uid') 
  //       .exec();

  //     res.status(200).json(messages);
  //   } catch (error) {
  //     console.error(error); // Affichez l'erreur dans la console pour le débogage.
  //     res.status(500).json("Erreur lors de l'affichage de l'historique d'une conversation");
  //   }
  // },


  async getMessagesByChat(req, res) {
    try {
      const chatId = req.params.chatId;
  
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ error: 'Invalid chatId' });
      }
      
      const offset = parseInt(req.query.offset) || 0; // Pagination offset
      const limit = parseInt(req.query.limit) || 10;  // Pagination limit
  
      const messages = await Message.find({ chat: chatId })
        .sort({ sentAt: 'asc' })
        .populate('user', 'uid')
        .skip(offset)
        .limit(limit)
        .exec();
  
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      const decryptedMessages = new Map();
  
      for (const message of messages) {
        let messageData = {
          type: message.type,
          user: message.user.uid,
          sentAt: message.sentAt,
          status: message.status,
          content: message.content, // Initialize with the original content
        };
  
        if (message.type === 'text' || message.type === 'quote') {
          const sharedKey = chat.sharedKey;
          const msg = message.content;
  
          if (message.type !== 'file') {
            try {
              const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
              const decryptedMessage = await decryptMessage(msg, decryptedSharedKey, ivKey);
  
              if (decryptedMessage) {
                messageData.content = decryptedMessage;
              }
            } catch (error) {
              console.error('Error decrypting message:', error);
            }
          }
        }
  
        decryptedMessages.set(message._id, messageData);
      }
  
      const formattedMessages = Array.from(decryptedMessages.values());
  
      res.status(200).json(formattedMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'affichage de l'historique d'une conversation" });
    }
  }




}