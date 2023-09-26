const Message = require('../models/message'); // Assurez-vous que la variable Message est correctement importée depuis le modèle
const readline=require('readline')
module.exports = io => {
    io.on("connection", socket => {
        console.log("Utilisateur connecté");
        socket.emit('connection');
        readMessage();

        socket.on("disconnect", () => {
            console.log("Utilisateur déconnecté");

            socket.disconnect();
            socket.emit('log2',"Utilisateur déconnecté");
        });
        
        socket.on('test2',(message)=>{
            
             console.log(`chat :`,`${socket.id}`, message); 
             // broadcast to everyone except sender
        })

        // messages entrants
        socket.on('chat-message', (data) => {
             console.log('Message reçu : ', data);
        
        //     // Enregistrement du message dans MongoDB
        //     const message = new Message({ user: data.user, text: data.message });
        //     message.save((err) => {
        //         if (err) {
        //             console.error('Error saving message to database:', err);
        //         } else {
        //             console.log('Message saved to the database');
        //         }
        //     });
        // });
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          });
        
        
        socket.on('close', (code, reason) => {
            console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
        });
    });
}
