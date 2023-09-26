const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");

socket.on('connection',()=>{
    console.log('connected');
    
})

socket.on('chat-message',(message)=>{
    console.log("message",message,"id",socket.id)
    console.log(socket.id);
})

socket.on('log2',()=>{
    console.log('"');
})

socket.emit('test2','message du client vers le serveur')