const Message = require('../models/message'); // Assurez-vous que la variable Message est correctement importée depuis le modèle

module.exports = io => {
    io.on("connection", socket => {
        console.log("Utilisateur connecté");
        socket.emit('connection');
        

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
        
        //     // Enregistrement du message dans MongoDB
        //     // const message = new Message({text: data.message });
        //     // message.save((err) => {
        //     //     if (err) {
        //     //         console.error('Error saving message to database:', err);
        //     //     } else {
        //     //         console.log('Message saved to the database');
        //     //     }
        //     // });
        // });
        
        // socket.on('chat-message',(message)=>{
        //     // Diffuser le message à tous les clients connectés
        //     //socket.broadcast.to(socket.id).emit('chat-message', message);
        //     socket.broadcast.emit('chat-message', message);
        // });
        // Lorsque le serveur reçoit un message du client
socket.on('chat-message', (messageData) => {
    console.log("Message : ", messageData.message, "de l'utilisateur avec id:", messageData.socketID);
});



        socket.on('close', (code, reason) => {
            console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
        });
    });
}
