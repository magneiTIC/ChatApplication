const Message = require('../models/message'); // Assurez-vous que la variable Message est correctement importée depuis le modèle

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
        // socket.on('chat-message', (data) => {
        //     console.log('Message reçu : ', data);
        socket.on('chat-message', (data) => {
            console.log('Message reçu du serveur : ', data);
          });
        
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
        
          function readMessage() {
            rl.question('Saisissez un message (ou tapez "exit" pour quitter) : ', (message) => {
              if (message.toLowerCase() === 'exit') {
                // Si l'utilisateur tape "exit", fermez l'interface de lecture et déconnectez le socket.
                rl.close();
                socket.disconnect();
              } else {
                // Sinon, envoyez le message au serveur WebSocket.
                socket.emit('chat-message', { user: 'Utilisateur du terminal', message });
          
                // Continuez à lire des messages.
                readMessage();
              }
            });
          }

        socket.on('close', (code, reason) => {
            console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
        });
    });
}
