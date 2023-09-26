Message = require('../models/message')
const io= require("socket.io")
// io => {
//     io.on("connection", socket => {
//         console.log("Utilisateur connecté");

//         socket.on("disconnect", () => {
//             console.log("Utilisateur déconnecté");
//             socket.emit("Utilisateur déconnecté");
//             socket.disconnect();
//         });
//         // messages entrants
//     socket.on('chat-message', (data) => {
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
io.on('connection', (socket) => {
    console.log("Un utilisateur s'est connecté");
    console.log(socket.id);
    socket.on('disconnect', () => {
     console.log("Un utilisateur s'est déconnecté");
    });
    
    io.on('chat-message', (data) => {
        console.log('Message reçu : ', data);
       
    });
    io.emit('chat-message',"message du serveur vers le client")

    socket.on('test2',(message)=>{
        console.log("message du client vers le serveur",message)
    })
    
    socket.on('close', (code, reason) => {
     console.log("La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}");
    });
   });

// Configuration des sockets
const options = {
  cors: {
    origin: '*',
    credentials: true,
  },
  pingTimeout: 60000,
};

module.exports = {options,io};

