const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");
const readline=require('readline')
socket.on('connection',()=>{
    console.log("connecté au serveur chat");
    console.log("chat: ",socket.id);
    readMessage();
})



socket.on('chat-message',(message)=>{
  const messageWithSocketID = {
    message: message,
    socketID: socket.id
};
    console.log("Message : ", message, "de l'utilisateur avec id:", socket.id )
})

socket.emit('chat-message',(message)=>{
  const messageData={
    message:message ,  // le contenu du message envoyé par l'utilisateur
    socketID:socket.id
  }
  console.log("Message : ", message, "de l'utilisateur avec id:", socket.id )
})

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
        socket.emit('chat-message',message) ;
  
        // Continuez à lire des messages.
        readMessage();
      }
    });
  }