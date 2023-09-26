// Message = require('../models/message')
// module.exports = io => {
//     io.on("connection", socket => {
//         console.log("Utilisateur connecté");

//         socket.on("disconnect", () => {
//             console.log("Utilisateur déconnecté");
//             socket.emit("Utilisateur déconnecté");
//             socket.disconnect();
//         });
//         // messages entrants
//     socket.on('chat message', (data) => {
//         console.log('Message reçu : ', data);
//     });

//     // enregistrement du message dans mongodb
//     const message = new Message({ user: data.user, text: data.message });
//     message.save((err) => {
//         if (err) {
//             console.error('Error saving message to database:', err);
//         } else {
//             console.log('Message saved to the database');
//         }
//     }); 
//     socket.on('close', (code, reason) => {
//         console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
//       });
//     });

    
// }
const socketIo = require('socket.io');

module.exports = server => {
    const io = socketIo(server, { pingTimeout: 60000 });

    io.on('connection', (socket) => {
        console.log('Un utilisateur s\'est connecté');

        socket.on('disconnect', () => {
            console.log('Un utilisateur s\'est déconnecté');
        });
    });
};
