const Message = require('../models/message'); 

const chatRooms = new Map(); // Map pour suivre les chatrooms

module.exports = io => {
  io.on("connection", socket => {
    console.log(`Utilisateur ${socket.id} connecté`);
    socket.emit('connection');

    socket.on("disconnect", () => {
      console.log(`Utilisateur ${socket.id} déconnecté`);
      // Supprimer l'utilisateur des chatrooms existantes lorsqu'il se déconnecte
      chatRooms.forEach((users, roomId) => {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          if (users.size === 0) {
            chatRooms.delete(roomId);
          }
        }
      });
      socket.disconnect();
      socket.emit('log2', `Utilisateur ${socket.id} déconnecté`);
    });

    socket.on('create-room', (otherUserId) => {
      // Créer une chatroom unique ID en fonction des deux IDs d'utilisateurs
      const roomIds = [socket.id, otherUserId].sort().join('-');
      
      // Vérifier si la chatroom existe déjà
      if (!chatRooms.has(roomIds)) {
        chatRooms.set(roomIds, new Set());
      }
      // Ajouter les utilisateurs à la chatroom
      chatRooms.get(roomIds).add(socket.id);
      
      // Envoyer un message au client pour indiquer la création de la chatroom
      socket.emit('room-created', roomIds);
    });

    socket.on('chat-message', (message, roomIds) => {
      if (chatRooms.has(roomIds) && chatRooms.get(roomIds).has(socket.id)) {
        // Vous pouvez enregistrer le message dans la base de données si nécessaire
        const messageWithSocketID = {
          message: message,
          socketID: socket.id
        };
        console.log("Message reçu : ", messageWithSocketID.message, "de l'utilisateur avec ID : ", messageWithSocketID.socketID);
        
        // Diffuser le message aux autres membres de la chatroom
        chatRooms.get(roomIds).forEach((userId) => {
          if (userId !== socket.id) {
            io.to(userId).emit('chat-message', message);
          }
        });
        console.log("Message : ", message, "de l'utilisateur avec id:", socket.id );
      }
    });

    socket.on('close', (code, reason) => {
      console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
    });
  });
};
