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
        // 
        
        

        socket.on('close', (code, reason) => {
            console.log(`La connexion WebSocket a été fermée avec le code ${code} et la raison : ${reason}`);
        });
    });
}
