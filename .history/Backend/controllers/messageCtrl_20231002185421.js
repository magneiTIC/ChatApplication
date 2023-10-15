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

    } catch (error) {
      
    }
  },

  //Liste des messages d'une conversation 
  async getMessagesByChat(req,res){
  }
}