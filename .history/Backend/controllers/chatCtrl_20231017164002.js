const Chat = require("../models/chat")
const Message=require("../models/message")
const Users= require("../models/user")
const mess
module.exports = {

  // Création d'une nouvelle conversation
  async createChat(req, res) {
      try {
          const { users } = req.body
          const newChat = new Chat({ users })
          await newChat.save();
          console.log("conversation créée avec succès");
          return res.status(200).json({ message: "conversation créée avec succès" })

      }
      catch (error) {
          console.log("Erreur lors de creation d'une conversation",error)
          res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
      }

  },

  
  //Liste des conversations d'un user
  // async getChatsByUser(req, res) {
  //   try {
  //     const uid = req.params.uid;
  //     const user = await Users.findOne({ uid });
  //     if (!user) {
  //       return res.status(404).json({ message: "Utilisateur introuvable." });
  //     }
  
  //     // Recherchez les chats où l'utilisateur est membre et utilisez populate pour obtenir le nom du destinataire.
  //     const chats = await Chat.find({ users: user._id })
  //       .populate({
  //         path: 'users',
  //         select: 'username',
  //         match: { uid: { $ne: uid } }, // Exclure l'utilisateur actuel
  //       });
  
  //     const filteredChats = chats.filter(chat => chat.users.length > 0); // Supprimer les chats vides
  
  //     res.status(200).json(filteredChats);
  //   } catch (error) {
  //     console.log("Erreur d'affichage des conversations d'un user", error);
  //     res.status(500).json({ error: "Erreur lors de l'affichage des conversations d'un user" });
  //   }
  // },
  async getChatsByUser(req, res) {
    try {
      const uid = req.params.uid;
      const user = await Users.findOne({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }
  
      const chats = await Chat.find({ users: user._id })
        .populate({
          path: 'users',
          select: 'username',
          match: { uid: { $ne: uid } },
        });
  
      const filteredChats = chats.filter(chat => chat.users.length > 0);
  
      const chatsWithLastMessages = [];
  
      for (const chat of filteredChats) {
        const lastMessage = await messageCtrl.getLastMessage(chat._id);
  
        if (lastMessage) {
          chatsWithLastMessages.push({
            lastMessage: {
              content: lastMessage.content,
              sentAt: lastMessage.sentAt,
            },
            users: chat.users,
          });
        }
      }
  
      res.status(200).json(chatsWithLastMessages);
    } catch (error) {
      console.log("Erreur d'affichage des conversations d'un user", error);
      res.status(500).json({ error: "Erreur lors de l'affichage des conversations d'un user" });
    }
  }
  
  ,

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
  },
  

}
