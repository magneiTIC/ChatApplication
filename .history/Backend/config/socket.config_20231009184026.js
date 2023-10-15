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

        socket.on('chat-message', (message) => {
            const messageWithSocketID = {
                message: message,
                socketID: socket.id
            };
            console.log("Message reçu : ", messageWithSocketID.message, "de l'utilisateur avec ID : ", messageWithSocketID.socketID);
            // Diffuser le message à tous les clients connectés
            // socket.broadcast.to(et.idsock).emit('chat-message', message);
            socket.broadcast.emit('chat-message', message);
            console.log("Message : ", message, "de l'utilisateur avec id:", socket.id )

        });

        socket.on('close', (code, reason) => {
            console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
        });
    });
};
