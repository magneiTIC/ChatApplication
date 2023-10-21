const Message = require('../models/message');

module.exports = io => {
  io.on("connection", socket => {
    console.log(`Utilisateur ${socket.id} connecté`);
    socket.emit('connection');

    socket.on("disconnect", () => {
      console.log(`Utilisateur ${socket.id} déconnecté`);
      socket.disconnect();
      socket.emit('log2', `Utilisateur ${socket.id} déconnecté`);
    });

    // Lorsque l'utilisateur se connecte, envoyez les messages non lus
    const userId = socket.id; // L'ID de l'utilisateur connecté
    const query = { user: userId, status: 'unread' }; // Recherchez les messages non lus (status = 'unread')

    Message.find(query)
      .then(messages => {
        // Envoyez les messages non lus à l'utilisateur
        messages.forEach((message) => {
          socket.emit('chat-message', message);
        });

        // Marquez les messages comme "lus" dans la base de données
        const updatePromises = messages.map((message) => {
          message.status = 'read'; // Marquez le message comme lu (status = 'read')
          return message.save();
        });

        return Promise.all(updatePromises);
      })
      .catch(err => {
        // Gérer les erreurs de recherche
      });

    socket.on('send-message', (message, messageType, targetUserId) => {
      // Enregistrez le message dans la base de données avec le statut "non lu" (status = 'unread') et le type de message
      const newMessage = new Message({
        user: socket.id, // L'expéditeur du message
        content: message,
        type: messageType, // Le type de message (text, image, video, audio, file, quote, etc.)
        status: 'unread', // Marquez le message comme non lu
        // Autres informations liées au message
      });

      newMessage.save()
        .then(savedMessage => {
          // Émettez le message à l'utilisateur cible, que ce soit en ligne ou hors ligne
          const targetSocket = userSockets.get(targetUserId);
          if (targetSocket) {
            targetSocket.emit('chat-message', savedMessage);
          }
        })
        .catch(err => {
          // Gérer les erreurs d'enregistrement
        });
    });

    socket.on('close', (code, reason) => {
      console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
    });

    // Mettez à jour le statut des messages de la discussion sélectionnée comme "read"
    socket.on('mark-messages-as-read', (chatId) => {
      Message.updateMany({ chat: chatId, status: 'unread' }, { status: 'read' })
        .then(() => {
          // Informer le client que les messages ont été marqués comme "lus"
          socket.emit('messages-marked-as-read', chatId);
        })
        .catch(err => {
          // Gérer les erreurs de mise à jour
        });
    });
  });
};
