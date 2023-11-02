const Message = require('../models/message');
const Chat=require('../models/chat')
const User = require('../models/user')

const formatSentAt = (sentAt) => {
  const currentDate = new Date();
  const lastMessageDate = new Date(sentAt);

  if (currentDate.toDateString() === lastMessageDate.toDateString()) {
    // Aujourd'hui : afficher l'heure uniquement
    const hours = lastMessageDate.getHours();
    const minutes = lastMessageDate.getMinutes();
    return `${hours}:${minutes}`;
  } else if (new Date(currentDate - 24 * 60 * 60 * 1000).toDateString() === lastMessageDate.toDateString()) {
    // Hier : afficher "Hier"
    return 'Hier';
  } else {
    // Date antérieure à hier : afficher la date sans l'heure
    const day = lastMessageDate.getDate();
    const month = lastMessageDate.getMonth() + 1;
    const year = lastMessageDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
};
module.exports={
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

        // sentAt: lastMessage ? formatSentAt(lastMessage.sentAt) : null,
      const formattedMessages = messages.map((message) => {
        let messageData = {
          type: message.type,
          user: message.user.uid,
          sentAt: message.sentAt,
          status: message.status,
        };
  
        if (message.type === 'text' || message.type === 'quote') {
          messageData.content = message.content;
        }
  
        if (message.media) {
          messageData.media = {};
  
          if (message.media.data && message.media.contentType) {
            messageData.media.data = message.media.data.toString('base64');
            messageData.media.contentType = message.media.contentType;
          } else {
            // Gérer le cas où les propriétés de message.media ne sont pas définies
            messageData.media.data = null;
            messageData.media.contentType = null;
          }
        }
  
        return messageData;
      });
  
      res.status(200).json(formattedMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json("Erreur lors de l'affichage de l'historique d'une conversation");
    }
  }
  
  
  
}