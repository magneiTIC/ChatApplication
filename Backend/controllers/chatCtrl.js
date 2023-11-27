const Chat = require("../models/chat")
const Message = require("../models/message")
const Users = require("../models/user")
const { uploadFileMiddleware } = require("./upload")
const { sharedKey, decryptMessage, decryptPrivateKey } = require("../config/generate-key")
const EncryptionKey = require("../models/encryption-key");
const encryptionKey = process.env.ENCRYPTION_KEY;
const ivKey = process.env.IV_KEY;
const {countUnreadMessages} =require ("./messageCtrl")

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
      const { idUsers } = req.body
      // Vérifier si un chat existe déjà avec les mêmes deux utilisateurs
      const existingChat = await Chat.findOne({
        users: { $all: idUsers },
      });

      if (existingChat) {
        console.log("La conversation existe déjà.");
        return res.status(200).json({ message: "La conversation existe déjà" });
      }
      const keysA = await EncryptionKey.findOne({ userId: idUsers[0] })
      const keysB = await EncryptionKey.findOne({ userId: idUsers[1] })
      const sharedkeyA = await sharedKey(keysA.privateKey, keysB.publicKey)
      const sharedkeyB = await sharedKey(keysB.privateKey, keysA.publicKey)
      if (sharedkeyA === sharedkeyB) {
        const newChat = new Chat({ users: idUsers, sharedKey: sharedkeyA })
        await newChat.save();
        console.log("conversation créée avec succès");
        return res.status(200).json({ message: "conversation créée avec succès" })
      }
    }
    catch (error) {
      console.log("Erreur lors de creation d'une conversation", error)
      res.status(500).json({ error: 'Erreur lors de la création de la conversation' });
    }
  },

  //bloquer une conversation 
  async blockMessagesInChat(req, res) {
    try {
      const { chatId } = req.params; // Vous pouvez passer l'ID de la conversation dans les paramètres de l'URL
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ error: 'Conversation non trouvée.' });
      }

      // Mettez à jour l'attribut `authorized` de la conversation à false
      chat.autorised = false;
      await chat.save();

      return res.status(200).json({ message: 'Messages bloqués avec succès dans la conversation.' });
    } catch (error) {
      console.log("Erreur lors du blocage des messages dans la conversation", error);
      res.status(500).json({ error: 'Erreur lors du blocage des messages dans la conversation' });
    }
  },

  //creation d'une conversation entre deux agents qui ne sont pas dans la même division
  async createChatWithExternalAgent(req, res) {
    try {
      const { emailUserA, emailUserB } = req.body; // Remplacez par les noms de vos champs
      const userA = await Users.findOne({ email: emailUserA });
      const userB = await Users.findOne({ email: emailUserB });
      console.log(`users: ${emailUserA} ${emailUserB}`)

      if (!userA || !userB) {
        return res.status(404).json({ error: 'Un ou plusieurs utilisateurs introuvables.' });
      }

      // Vérifier si un chat existe déjà avec les mêmes deux utilisateurs
      const existingChat = await Chat.findOne({
        users: { $all: [userA._id, userB._id] },
      });

      if (existingChat) {
        console.log("La conversation existe déjà.");
        return res.status(200).json({ message: "La conversation existe déjà" });
      }

      const keysA = await EncryptionKey.findOne({ userId: userA._id });
      const keysB = await EncryptionKey.findOne({ userId: userB._id });
      const sharedkeyA = await sharedKey(keysA.privateKey, keysB.publicKey)
      const sharedkeyB = await sharedKey(keysB.privateKey, keysA.publicKey)

      if (sharedkeyA === sharedkeyB) {
        const newChat = new Chat({ users: [userA._id, userB._id], sharedKey: sharedkeyA });
        await newChat.save();
        console.log("Conversation créée avec succès");
        return res.status(200).json({ message: "Conversation créée avec succès" });
      } else {
        return res.status(400).json({ error: "Échec de génération de la clé partagée." });
      }
    } catch (error) {
      console.log("Erreur lors de la création d'une conversation", error);
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
  
          const sharedKey = chat.sharedKey;
          const lastMessageInfo = {
            sentAt: lastMessage ? formatSentAt(lastMessage.sentAt) : null,
            content: null, // Initialize with null
            unreadMessages: 0, // Initialize with 0 unread messages
          };
  
          if (lastMessage) {
            const msg = lastMessage.content;
  
            // Conditionally skip decryption for "file" type messages
            if (lastMessage.type !== "file") {
              const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
              const decryptedMessage = await decryptMessage(msg, decryptedSharedKey, ivKey);
              lastMessageInfo.content = decryptedMessage;
            } else {
              lastMessageInfo.content = msg; // No decryption for "file" type
            }
          }
  
          // Calcul du nombre de messages non lus
          const unreadMessages = await countUnreadMessages(chat._id,user._id)
          lastMessageInfo.unreadMessages = unreadMessages;
  
          return {
            lastMessage: lastMessageInfo,
            users: chat.users,
            chatId: chat._id,
            sharedKey: chat.sharedKey,
          };
        })
      );
  
      res.status(200).json(chatsWithLastMessages);
    } catch (error) {
      console.log("Erreur d'affichage des conversations d'un user", error);
      res.status(500).json({ error: "Erreur lors de l'affichage des conversations d'un user" });
    }
  }
  ,


  //peupler une conversation
  async addMediaToChat(req, res) {
    try {
      const chatId = req.params.chatId;
      const { user, type } = req.body;
      const media = req.file.path
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ error: 'Conversation non trouvée' });
      }
      if (chat.autorised == false) {
        return res.status(403).json({ error: 'Envoi de messages bloqué dans cette conversation.' });
      }

      const messageData = {
        user,
        chat: chatId,
        type,
      };

      if (['image', 'video', 'audio', 'file'].includes(type)) {

        if (!media) {
          console.error("Multer error: File not uploaded");
          return res.status(500).json({ error: "Erreur lors de l'envoi du média" });
        }

        // Multer has stored the uploaded file in req.file
        messageData.content = media;
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
  },

  addMessageToChat
}

async function addMessageToChat(chatId, user, content, type) {
  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return { error: 'Conversation non trouvée' };
    }
    if (chat.autorised == false) {
      return ({ error: 'Envoi de messages bloqué dans cette conversation.' });
    }

    const messageData = {
      user,
      chat: chatId,
      type,
    };

    if (type === 'text' || type === 'quote') {
      messageData.content = content;
    }

    const message = new Message(messageData);
    await message.save();

    chat.messages.push(message._id);
    await chat.save();

    return chat;
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de l'ajout du message à la conversation" };
  }
}

async function addMediaToChat(req, res) {
  try {
    const chatId = req.params.chatId;
    const { user, type } = req.body;
    const media = req.file.path
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const messageData = {
      user,
      chat: chatId,
      type,
    };

    if (['image', 'video', 'audio', 'file'].includes(type)) {

      if (!media) {
        console.error("Multer error: File not uploaded");
        return res.status(500).json({ error: "Erreur lors de l'envoi du média" });
      }

      // Multer has stored the uploaded file in req.file
      messageData.content = media;
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
