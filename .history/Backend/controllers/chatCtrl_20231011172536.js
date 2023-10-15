const Chat = require("../models/chat")
const Message=require("../models/message")
module.exports = {

  // Création d'une nouvelle conversation
  // async createChat(req, res) {
  //     try {
  //         const { users } = req.body
  //         const newChat = new Chat({ users })
  //         await newChat.save();
  //         console.log("conversation créée avec succès");
  //         return res.status(200).json({ message: "conversation créée avec succès" })

  //     }
  //     catch (error) {
  //         console.log("Erreur lors de creation d'une conversation",error)
  //         res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
  //     }

  // },

  //Liste des conversations d'un user
  async getChatsByUser(req, res) {
    try {
      const userId = req.params.userId;
      const chats = await Conversation.find({ users: userId });
      res.status(200).json(chats);
    }

    catch (error) {
      console.log("Erreur d'affichage des conversations d'un user", error)
      res.status(500).json({ error: "Erreur lors de l'affichage des conversations d'un user" })
    }
  },

  //peupler une conversation


  async addMessageToChat(req, res) {
    try {
      const { chatId, user, content } = req.body;
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }
      const message = new Message({
        user,
        content,
        chat: chatId,
      });
      await message.save();
      chat.messages.push(message._id);
      await chat.save();
  
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout du message à la conversation" });
    }
  }
  

}
