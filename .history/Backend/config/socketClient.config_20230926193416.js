const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");
const readline=require('readline')
socket.on('connection',()=>{
    console.log("connecté au serveur chat");
    console.log("chat: ",socket.id);
})

socket.on('chat-message',(message)=>{
    console.log("message",message,"id",socket.id)
    
})

socket.on('log2',(message)=>{
    console.log("Message de log 1 : ", message, "de l'utilisateur avec id:", socket.id )
})

socket.emit('test2','message du client vers le serveur')