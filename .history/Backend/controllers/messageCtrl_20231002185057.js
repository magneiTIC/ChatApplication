const Message = require('../models/message');
const User = require('../models/user')
module.exports={
  //Création d'un nouveau message
  async createMessage(req,res){
    try {
      const { sender, text, chatId } = req.body;
      const newMessage = new Message({
        sender,
        text,
        chat: conversationId,
      });
  
      await newMessage.save();
  
      res.status(201).json(newMessage);

    } catch (error) {
      
    }
  }
}