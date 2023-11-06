const Message = require('../models/message');
const Chat = require('../models/chat')
const User = require('../models/user')
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
      const messages = await Message.find({ chat: chatId })
        .sort({ sentAt: 'asc' })
        .populate('user', 'uid')
        .exec();

      // Retrieve the chat with the given chatId
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json('Chat not found');
      }

      const formattedMessages = await Promise.all(messages.map(async (message) => {
        let messageData = {
          type: message.type,
          user: message.user.uid,
          sentAt: message.sentAt,
          status: message.status,
        };

        //console.log('message content', message.content);
        if (message.type === 'text' || message.type === 'quote') {
          // Retrieve the sharedKey from the chat
          const sharedKey = chat.sharedKey;
          const msg = message.content;

          // Decrypt the sharedKey using decryptPrivateKey, assuming it returns a valid shared key
          const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
          if (decryptedSharedKey) {
            //console.log('true')
            //console.log('decrypted shared key', decryptedSharedKey)
            const decryptedMessage = await decryptMessage(msg, decryptedSharedKey, ivKey);
            if (decryptedMessage) {
              // console.log('decrypted message', decryptedMessage)
              messageData.content = decryptedMessage;

            }

          }
          // const decryptedMessage = await decryptMessage(msg, decryptedSharedKey, ivKey);
          //messageData.content = decryptedMessage;
        } else if (message.type === 'file') {
          //messageData.content = decryptedMessage;
        }

        console.log('message data', messageData)
        return messageData;

      }));

      res.status(200).json(formattedMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json("Erreur lors de l'affichage de l'historique d'une conversation");
    }
  }




}