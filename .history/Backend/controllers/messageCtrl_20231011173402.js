const Message = require('../models/message');
const Chat=require('../models/chat')
const User = require('../models/user')
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
  async getMessagesByChat(req, res) {
    try {
      const chatId = req.params.chatId;
      console.log("chatid", chatId);
      const messages = await Message.find({ chat: chatId })
        .sort({ sentAt: 'asc' })
        .exec();
  
      res.status(200).json(messages);
    } catch (error) {
      console.error(error); // Affichez l'erreur dans la console pour le débogage.
      res.status(500).json("Erreur lors de l'affichage de l'historique d'une conversation");
    }
  },
  async getLastMessage(chatId) {
    try {
      // Récupérez la conversation par son ID
      const chat = await Chat.findById(chatId);
      if (!chat) {
        throw new Error("Conversation non trouvée");
      }
  
      // Triez les messages par date d'envoi décroissante
      const sortedMessages = chat.messages.sort((a, b) => b.sentAt - a.sentAt);
  
      // Récupérez le premier message (le dernier message envoyé)
      const lastMessage = sortedMessages[0];
  
      return lastMessage;
    } catch (error) {
      throw error; // Gérez les erreurs comme vous le souhaitez
    }
  }
  
  
}