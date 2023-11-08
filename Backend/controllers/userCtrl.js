const admin = require('firebase-admin');
const User = require("../models/user");
const Chat=require('../models/chat')
const Message = require("../models/message")
const { sharedKey, decryptMessage, decryptPrivateKey } = require("../config/generate-key")
const encryptionKey = process.env.ENCRYPTION_KEY;
const ivKey = process.env.IV_KEY;


module.exports = {

  async isProfileConfigured(req, res) {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      } else {
        const checkUsername = user.username;
        const checkUid = user.uid;
        if (checkUsername === checkUid) {
          res.json({ isProfileConfigured: false });
        } else {
          res.status(200).json({ isProfileConfigured: true, profil: user.profile, division: user.division });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil :', error);
      res.status(500).json({ message: 'Erreur lors de la vérification du profil' });
    }
  },

  async register(req, res) {
    const { username, email, password } = req.body
    try {
      // Creer un compte sur firebase
      const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
      });
      const userUID = userRecord.uid;
      // Mettre à jour le profil de l'utilisateur dans MongoDB
      await User.findOneAndUpdate(
        { email: email }, { username: username, uid: userUID }
      );
      // Réponse de succès
      res.status(200).json({ message: 'Inscription terminée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la tentative de terminer l\'inscription :', error);
      // Gérez les erreurs ici
      res.status(500).json({ message: 'Erreur lors de la tentative de terminer l\'inscription' });
    }
  },

  async getAllUsersInSameDivision(req, res) {
    try {
      const uid = req.params.uid;
      // Recherchez l'utilisateur en fonction de son ID pour obtenir sa division
      const user = await User.findOne({ uid });
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      const division = user.division;
      // Utilisez la méthode find() de Mongoose pour rechercher les utilisateurs de la même division
      const users = await User.find({ division, uid: { $ne: uid } });
      if (users.length === 0) {
        return res.status(404).json({ message: "Aucun utilisateur trouvé dans la même division." });
      }
      res.json(users);
    }
    catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },

  async getUserIdByUid(req, res) {
    try {
      const uid = req.params.uid;
      const user = await User.findOne({ uid: uid });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      res.status(200).json({ id: user.id });
    } catch (error) {
      console.error("Erreur lors de la recherche de l'ID de l'utilisateur par UID", error);
      res.status(500).json({ error: "Erreur lors de la recherche de l'ID de l'utilisateur par UID" });
    }
  },

  async getUserByUid(req, res) {
    try {
      const uid = req.params.uid;
      const user = await User.findOne({ uid: uid });

      if (!user) {
        return res.status(404).json({ message: "Utilisateur introuvable." });
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error("Erreur lors de la recherche de l'ID de l'utilisateur par UID", error);
      res.status(500).json({ error: "Erreur lors de la recherche de l'ID de l'utilisateur par UID" });
    }
  },

  async setUserStatus(req, res) {
    const userId = req.params.uid;
    const newStatus = req.body.status;
    let connectionTime = null;
    let disconnectionTime = null;

    if (newStatus === 'connecté') {
      connectionTime = new Date().toISOString(); // Met à jour l'heure de connexion
    } else if (newStatus === 'déconnecté') {
      disconnectionTime = new Date().toISOString(); // Met à jour l'heure de déconnexion
    }

    try {
      const user = await User.findOneAndUpdate(
        { uid: userId },
        { status: newStatus, connectionTime, disconnectionTime },
        { new: true }
      );

      if (user) {
        res.status(200).json({ message: 'Statut, heure de connexion et heure de déconnexion mis à jour avec succès', user });
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut, de l\'heure de connexion et de l\'heure de déconnexion' });
    }
  },
  //liste des contacts dans la meme division de l'utilisateur 
  async listContactsInSameDivision(req, res) {
    try {
      const uid = req.params.uid;
      const user = await User.findOne({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const divisionName = user.division;
  
      const usersInSameDivision = await User.find({ division: divisionName, uid: { $ne: uid } });
  
      if (usersInSameDivision.length === 0) {
        return res.status(404).json({ message: "No users found in the same division." });
      }
  
      const contactList = await Promise.all(
        usersInSameDivision.map(async (contactUser) => {
          const contactChats = await Chat.find({ users: { $all: [user._id, contactUser._id] } });
  
          // Default message info in case no conversation found
          const lastMessageInfo = {
            sentAt: null,
            content: null
          };
  
          if (contactChats.length > 0) {
            const lastMessage = await Message.findOne({ chat: contactChats[0]._id })
              .sort({ sentAt: -1 })
              .exec();
  
            if (lastMessage) {
              const sharedKey = contactChats[0].sharedKey;
              const msg = lastMessage.content;
              if (lastMessage.type !== "file") {
                const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
                const decryptedMessage = await decryptMessage(msg, decryptedSharedKey, ivKey);
                lastMessageInfo.content = decryptedMessage;
              } else {
                lastMessageInfo.content = msg; // No decryption for "file" type
              }
  
              lastMessageInfo.sentAt = lastMessage.sentAt;
            }
          }
  
          return {
            lastMessage: lastMessageInfo,
            users: [contactUser], // Exclude the current user and include only the contactUser
            chatId: contactChats.length > 0 ? contactChats[0]._id : null,
            sharedKey: contactChats.length > 0 ? contactChats[0].sharedKey : null
          };
        })
      );
  
      res.status(200).json(contactList);
    } catch (error) {
      console.error('Error while listing contacts in the same division:', error);
      res.status(500).json({ error: 'Error while listing contacts in the same division' });
    }
  },

  //liste des contacts ddans les autres divisions de l'utilisateur
  async contactsByDivision(req, res) {
    try {
      const uid = req.params.uid;
      const user = await User.findOne({ uid });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const divisionName = user.division;
  
      const usersInDifferentDivision = await User.find({ division: { $ne: divisionName } });
  
      if (usersInDifferentDivision.length === 0) {
        return res.status(404).json({ message: "No users found in a different division." });
      }
  
      const contactList = await Promise.all(
        usersInDifferentDivision.map(async (contactUser) => {
          let lastMessageInfo = {
            sentAt: null,
            content: null
          };
  
          const contactChats = await Chat.find({
            users: { $all: [user._id, contactUser._id] },
            autorised: true // Filter by the authorized field
          });
  
          if (contactChats.length > 0) {
            const lastMessage = await Message.findOne({ chat: contactChats[0]._id })
              .sort({ sentAt: -1 })
              .exec();
  
            if (lastMessage) {
              const sharedKey = contactChats[0].sharedKey;
              const msg = lastMessage.content;
              if (lastMessage.type !== "file") {
                const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
                const decryptedMessage = await decryptMessage(msg, decryptedSharedKey, ivKey);
                lastMessageInfo.content = decryptedMessage;
              } else {
                lastMessageInfo.content = msg; // No decryption for "file" type
              }
  
              lastMessageInfo.sentAt = lastMessage.sentAt;
            }
          }
  
          return {
            lastMessage: lastMessageInfo,
            users: [contactUser], // Exclude the current user and include only the contactUser
            chatId: contactChats.length > 0 ? contactChats[0]._id : null,
            sharedKey: contactChats.length > 0 ? contactChats[0].sharedKey : null
          };
        })
      );
  
      const filteredContactList = contactList.filter((contact) => contact !== null);
  
      res.status(200).json(filteredContactList);
    } catch (error) {
      console.error('Error while listing contacts in a different division:', error);
      res.status(500).json({ error: 'Error while listing contacts in a different division' });
    }
  }
  
  
  
  
  
}
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
// const generateToken = (userId) => {
//   const token = jwt.sign({ userId }, tokenKey, { expiresIn: '1h' }); // Vous pouvez définir une durée d'expiration appropriée
//   return token;
// };

