const Chat = require("../models/chat")
const Message=require("../models/message")
const Users= require("../models/user")


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
  async getChatsByUser(req, res) {
    try {
      const uid = req.params.uid;
      const user = await Users.findOne({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }
  
      // Recherchez les chats où l'utilisateur est membre et utilisez populate pour obtenir le nom du destinataire.
      const chats = await Chat.find({ users: user._id }).populate({
        path: 'users',
        select: 'username uid',
        match: { uid: { $ne: uid } }, // Exclure l'utilisateur actuel
      });
  
      const filteredChats = chats.filter((chat) => chat.users.length > 0); // Supprimer les chats vides
  
      const chatsWithLastMessages = await Promise.all(
        filteredChats.map(async (chat) => {
          const lastMessage = await Message.findOne({ chat: chat._id })
            .sort({ sentAt: -1 })
            .exec();
  
          const lastMessageInfo = {
            sentAt: lastMessage ? formatSentAt(lastMessage.sentAt) : null,
            content: lastMessage ? lastMessage.content : null, // Utilisez le content du dernier message ou null s'il n'y en a pas
          };
  
          return {
            lastMessage: lastMessageInfo,
            users: chat.users,
            chatId: chat._id
          };
        })
      );
  
      res.status(200).json(chatsWithLastMessages);
    } catch (error) {
      console.log("Erreur d'affichage des conversations d'un user", error);
      res.status(500).json({ error: "Erreur lors de l'affichage des conversations d'un user" });
    }
  },
  
  //peupler une conversation
  // async addMessageToChat(req, res) {
  //   try {
  //     const { chatId, user, content } = req.body;
  //     const chat = await Chat.findById(chatId);
  
  //     if (!chat) {
  //       return res.status(404).json({ error: 'Conversation non trouvée' });
  //     }
  //     const message = new Message({
  //       user,
  //       content,
  //       chat: chatId,
  //     });
  //     await message.save();
  //     chat.messages.push(message._id);
  //     await chat.save();
  
  //     res.status(200).json(chat);
  //   } catch (error) {
  //     res.status(500).json({ error: "Erreur lors de l'ajout du message à la conversation" });
  //   }
  // },
  async addMessageToChat(req, res) {
    try {
      const { chatId, user, type, content, media } = req.body;
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }
  
      const messageData = {
        user,
        chat: chatId,
        type, // Le type de message (text, image, video, audio, file, quote, etc.)
      };
  
      if (type === 'text' || type === 'quote') {
        // Si le message est de type texte ou quote, enregistrez le contenu du message
        messageData.content = content;
      } else if (type === 'image' || type === 'video' || type === 'audio' || type === 'file') {
        // Si le message est de type image, vidéo, audio ou fichier, enregistrez le contenu du média
        messageData.media = {
          data: Buffer.from(media.data, 'base64'), // Convertir les données base64 en binaire
          contentType: media.contentType, // Type MIME du média
        };
      }
  
      const message = new Message(messageData);
      await message.save();
  
      chat.messages.push(message._id);
      await chat.save();
  
      res.status(200).json(chat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'ajout du message à la conversation" });
    }
  }
  
  

}
