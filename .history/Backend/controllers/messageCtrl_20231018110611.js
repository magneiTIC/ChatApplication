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
  
  // async getLastMessage(req, res) {
  //   try {
  //     const chatId = req.params.chatId;
  //     const chat = await Chat.findById(chatId);
  
  //     if (!chat) {
  //       return res.status(404).json({ error: 'Conversation non trouvée' });
  //     }
  
  //     const lastMessage = await Message.findOne({ chat: chatId })
  //       .sort({ sentAt: -1 })
  //       .exec();
  
  //     if (!lastMessage) {
  //       return res.status(404).json({ error: 'Aucun message trouvé dans cette conversation' });
  //     }
  
  //     const currentDate = new Date();
  //     const lastMessageDate = new Date(lastMessage.sentAt);
  
  //     const isToday = currentDate.toDateString() === lastMessageDate.toDateString();
  //     const isYesterday = new Date(currentDate - 24 * 60 * 60 * 1000).toDateString() === lastMessageDate.toDateString();
  
  //     let formattedDate;
  
  //     if (isToday) {
  //       // Afficher l'heure uniquement
  //       const hours = lastMessageDate.getHours();
  //       const minutes = lastMessageDate.getMinutes();
  //       formattedDate = `${hours}:${minutes}`;
  //     } else if (isYesterday) {
  //       formattedDate = 'Hier';
  //     } else {
  //       // Afficher la date sans l'heure
  //       const day = lastMessageDate.getDate();
  //       const month = lastMessageDate.getMonth() + 1;
  //       const year = lastMessageDate.getFullYear();
  //       formattedDate = `${day}/${month}/${year}`;
  //     }
  
  //     const lastMessageInfo = {
  //       content: lastMessage.content,
  //       sentAt: formattedDate,
  //     };
  
  //     res.status(200).json(lastMessageInfo);
  //   } catch (error) {
  //     res.status(500).json({ error: "Erreur lors de l'affichage du dernier message de cette conversation" });
  //   }
  // }
  
}