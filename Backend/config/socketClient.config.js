const { io } = require("socket.io-client");
const socket = io("http://localhost:3000"); // Replace with the actual server address

socket.on('connect', () => {
    console.log("Connecté au serveur chat");
    console.log("Chat ID : ", socket.id);
    readMessage();
});

socket.on('chat-message', (message) => {
    console.log("Message reçu : ", message.content, "de l'utilisateur avec ID : ", message.user);
});

function readMessage() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Saisissez un message (ou tapez "exit" pour quitter) : ', (message) => {
        if (message.toLowerCase() === 'exit') {
            rl.close();
            socket.disconnect();
        } else {
            socket.emit('send-message', message, 'text', /* Replace with the target user's ID */);
            readMessage();
        }
    });
} 
 