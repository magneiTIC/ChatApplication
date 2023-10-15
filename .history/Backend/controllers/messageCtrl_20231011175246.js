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
  async getLastMessage(req, res) {
    try {
      const chatId = req.params.chatId;
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }
  
      const lastMessage = await Message.findOne({ chat: chatId })
        .sort({ sentAt: -1 })
        .exec();
  
      if (!lastMessage) {
        return res.status(404).json({ error: 'Aucun message trouvé dans cette conversation' });
      }
  
      const lastMessageInfo = {
        content: lastMessage.content,
        sentAt: lastMessage.sentAt,
      };
  
      res.status(200).json(lastMessageInfo);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'affichage du dernier message de cette conversation" });
    }
  }
  
  
  
}