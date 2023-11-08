const Message = require('../models/message');
const Chat = require('../models/chat')
const userSockets = new Map();
const mongoose = require('mongoose');
const { decryptPrivateKey, encryptMessage } = require('../config/generate-key')
require('dotenv').config();
const encryptionKey = process.env.ENCRYPTION_KEY;
const ivKey = process.env.IV_KEY;
const { addMessageToChat } = require ('../controllers/chatCtrl')

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
            //socket.emit('chat-message', message);
          });
          console.log("Affichage des messages non lus");
        })
        .catch(err => {
          console.log("Erreur lors du chargement des messages non lus", err);
        });
    } else {
      console.log("L'utilisateur n'est pas connecté ou l'ID n'est pas valide.");
    }


    socket.on('send-message', async (message, targetUserId, sharedKey,chatId,user,type) => {
      // Émettez le message à l'utilisateur emetteur, que ce soit en ligne ou hors ligne
      //console.log("ivkey",ivKey)
      const decryptedSharedKey = (await decryptPrivateKey(sharedKey, encryptionKey, ivKey)).toString();
      //console.log('decrypted shared key',decryptedSharedKey)
      const encryptedMessageObject = (await encryptMessage(message, decryptedSharedKey))
      console.log("message crypté",encryptedMessageObject.encryptedMessage)
      content=encryptedMessageObject.encryptedMessage
       const msg= await addMessageToChat(chatId,user,content,type)
      console.log('message dans la base de données',msg)
      await socket.emit('chat-message', encryptedMessageObject.encryptedMessage);

      const targetSocket = userSockets.get(targetUserId);
      console.log("target socket id", targetSocket ? targetSocket.id : "N/A");

      // Vérifiez si le socket de l'utilisateur cible existe
      if (targetSocket) {
        // Émettez le message à l'utilisateur cible
        try {

          await socket.to(targetSocket.id).emit('chat-message', encryptedMessageObject.encryptedMessage)

          //await targetSocket.emit('chat-message', message);
          console.log("Message envoyé avec succès à l'utilisateur cible");

          console.log("message ", message)
        } catch (error) {
          console.error("Erreur lors de l'émission du message à l'utilisateur cible:", error);
        }
      } else {
        // L'utilisateur cible n'est pas en ligne, vous pouvez gérer cela comme vous le souhaitez
        await socket.emit('chat-message', encryptedMessageObject.encryptedMessage);
        console.log("L'utilisateur cible n'est pas en ligne, vous pouvez prendre des mesures appropriées ici.");
      }
    });

    socket.on('send-file', async (message, targetUserId) => {
      // Émettez le message à l'utilisateur emetteur, que ce soit en ligne ou hors ligne
      await socket.emit('file-received', message);

      const targetSocket = userSockets.get(targetUserId);
      console.log("target socket id", targetSocket ? targetSocket.id : "N/A");

      // Vérifiez si le socket de l'utilisateur cible existe
      if (targetSocket) {
        // Émettez le message à l'utilisateur cible
        try {
      
          await socket.to(targetSocket.id).emit('file-received', message)
          
          //await targetSocket.emit('chat-message', message);
          console.log("Message envoyé avec succès à l'utilisateur cible");

          console.log("message ", message)
        } catch (error) {
          console.error("Erreur lors de l'émission du message à l'utilisateur cible:", error);
        }
      } else {
        // L'utilisateur cible n'est pas en ligne, vous pouvez gérer cela comme vous le souhaitez
        await socket.emit('file-received', message);
        console.log("L'utilisateur cible n'est pas en ligne, vous pouvez prendre des mesures appropriées ici.");
      }
    });


    socket.on('close', (code, reason) => {
      console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
    });

    // Mettez à jour le statut des messages de la discussion sélectionnée comme "read"
    socket.on('mark-messages-as-read', async (chatId, userId) => {
      try {
        //Vérifiez si chatId et userId sont des ObjectId valides
        if (userId && mongoose.isValidObjectId(userId) && chatId && mongoose.isValidObjectId(chatId)){
        // Recherchez le chat en utilisant l'ID du chat.
        const chat = await Chat.findById(chatId);
        if (!chat) {
         
        }
         // Recherchez tous les messages dans le chat dont l'utilisateur n'est pas l'expéditeur
        // et qui ont le statut 'unread'.
        const messagesToMarkAsRead = await Message.updateMany(
          {
            chat: chat._id,
            user: { $ne: userId }, // L'utilisateur n'est pas l'expéditeur.
            status: 'unread',
          },
          { $set: { status: 'read' } } // Marquez les messages comme 'read'.
        );
    
        if (messagesToMarkAsRead.nModified > 0) {
          // Au moins un message a été marqué comme lu.
          // Vous pouvez émettre un événement pour informer les clients que les messages ont été marqués comme lus.
           socket.emit('messages-marked-as-read', messagesToMarkAsRead.nModified);
        }
        }
      } catch (error) {
        console.error("Erreur lors du marquage des messages comme lus :", error);

      }
    });
  });
};
