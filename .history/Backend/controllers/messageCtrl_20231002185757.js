const Message = require('../models/message');
const User = require('../models/user')
module.exports={
  //Création d'un nouveau message
  async createMessage(req,res){
    try {
      const { user, content, chatId } = req.body;
      const newMessage = new Message({
        user,
        content,
        chat: chatId,
      });
  
      await newMessage.save();
  
      res.status(201).json(newMessage);

    } 
    catch (error) {
      console.log("erreur lors de la création d'un message", error );
      res.status(501).json({ error: 'Erreur lors de la création du message' });
    }
  },

  //Liste des messages d'une conversation 
  async getMessagesByChat(req,res){
    try {
      const chatId=req.params.chatId
      const messages= await Message({chat:chatId})
    } catch (error) {
      
    }
  }
}