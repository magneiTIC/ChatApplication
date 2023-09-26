const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.on('connection',()=>{
    console.log("Utilisateur connecté");
    console.log("chatsocket.id);
})

socket.on('chat-message',(message)=>{
    console.log("message",message,"id",socket.id)
    
})

socket.on('log2',(message)=>{
    console.log("Message de log 1 : ", message, "de l'utilisateur avec id:", socket.id )
})

socket.emit('test2','message du client vers le serveur')