const Message = require('../models/message');
const userSockets = new Map();
const mongoose = require('mongoose');
const { decryptPrivateKey, encryptMessage } = require('../config/generate-key')
require('dotenv').config();
const encryptionKey = process.env.ENCRYPTION_KEY;
const ivKey = process.env.IV_KEY;

module.exports = io => {
  io.on("connection", socket => {
    const userId = String(socket.handshake.query.userId);
    console.log(`Utilisateur ${socket.id} connecté et son id est ${userId}`);
    userSockets.set(userId, socket);
    socket.emit('connection');

    socket.on("disconnect", () => {
      console.log(`Utilisateur ${socket.id} déconnecté`);
      socket.disconnect();
      userSockets.delete(socket.id);
      socket.emit('log2', `Utilisateur ${socket.id} déconnecté`);
    });

    // Lorsque l'utilisateur se connecte, envoyez les messages non lus s'il y a un ID utilisateur valide
    if (userId && mongoose.isValidObjectId(userId)) { // Utilisez mongoose.isValidObjectId pour vérifier si l'ID est valide
      const query = { user: new mongoose.Types.ObjectId(userId), status: 'unread' };
      Message.find(query)
        .then(messages => {
          // Envoyez les messages non lus à l'utilisateur.
          messages.forEach((message) => {
            socket.emit('chat-message', message);
            console.log("Affichage des messages non lus");
          });
        })
        .catch(err => {
          console.log("Erreur lors du chargement des messages non lus", err);
        });
    } else {
      console.log("L'utilisateur n'est pas connecté ou l'ID n'est pas valide.");
    }


    socket.on('send-message', async (message, targetUserId, sharedKey) => {
      // Émettez le message à l'utilisateur emetteur, que ce soit en ligne ou hors ligne
      const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
      const encryptedMessage = (await encryptMessage(message, sharedKey)).toString();
      await socket.emit('chat-message', encryptedMessage);

      const targetSocket = userSockets.get(targetUserId);
      console.log("target socket id", targetSocket ? targetSocket.id : "N/A");

      // Vérifiez si le socket de l'utilisateur cible existe
      if (targetSocket) {
        // Émettez le message à l'utilisateur cible
        try {

          await socket.to(targetSocket.id).emit('chat-message', encryptedMessage)

          //await targetSocket.emit('chat-message', message);
          console.log("Message envoyé avec succès à l'utilisateur cible");

          console.log("message ", message)
        } catch (error) {
          console.error("Erreur lors de l'émission du message à l'utilisateur cible:", error);
        }
      } else {
        // L'utilisateur cible n'est pas en ligne, vous pouvez gérer cela comme vous le souhaitez
        await socket.emit('chat-message', encryptedMessage);
        console.log("L'utilisateur cible n'est pas en ligne, vous pouvez prendre des mesures appropriées ici.");
      }
    });


    socket.on('close', (code, reason) => {
      console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
    });

    //Mettez à jour le statut des messages de la discussion sélectionnée comme "read"
    // socket.on('mark-messages-as-read', async (chatId) => {
    //   try {
    //     // Supposons que vous ayez une structure de données de message avec un champ "status" pour le suivi de l'état de lecture
    //     const query = { chat: chatId, status: 'unread' }; // Recherchez les messages non lus (status = 'unread')

    //     const messages = await Message.find(query);

    //     // Marquez les messages comme "lus" dans la base de données
    //     const updatePromises = messages.map(async (message) => {
    //       message.status = 'read'; // Marquez le message comme lu (status = 'read')
    //       await message.save();
    //     });

    //     await Promise.all(updatePromises);

    //     // Informez le client que les messages ont été marqués comme "lus"
    //     socket.emit('messages-marked-as-read', chatId);
    //   } catch (error) {
    //     // Gérer les erreurs de mise à jour
    //     console.error("Erreur lors du marquage des messages comme lus :", error);
    //   }
    // });
    // Mettez à jour le statut des messages de la discussion sélectionnée comme "read"
    socket.on('mark-messages-as-read', async (chatId) => {
      try {
        // Vérifiez si chatId est un ObjectId valide
        if (chatId && mongoose.isValidObjectId(chatId)) {
          const query = { chat: new mongoose.Types.ObjectId(chatId), status: 'unread' };

          const messages = await Message.find(query);

          // Marquez les messages comme "lus" dans la base de données
          const updatePromises = messages.map(async (message) => {
            message.status = 'read'; // Marquez le message comme lu (status = 'read')
            await message.save();
          });

          await Promise.all(updatePromises);

          // Informez le client que les messages ont été marqués comme "lus"
          socket.emit('messages-marked-as-read', chatId);
        } else {
          console.log("Invalid chatId or chatId is null.");
        }
      } catch (error) {
        // Gérer les erreurs de mise à jour
        console.error("Erreur lors du marquage des messages comme lus :", error);
      }
    });

  });
};
