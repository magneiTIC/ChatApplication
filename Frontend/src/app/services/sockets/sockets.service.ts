// import { Injectable } from '@angular/core';
// import { io } from 'socket.io-client';
// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {
//   private socket;
//   private socketId!: string;
//   apiUrl = 'http://localhost:3000'
//   constructor() {
//     this.socket = io(this.apiUrl); 
//   //   this.socket.on('connect', () => {
//   //     console.log("Connecté au serveur chat");
//   //     console.log("Chat ID : ", this.socket.id);
      
//   // });
//   }
//   connect() {
//     this.socket.connect(); // Établissez la connexion au serveur Socket.io

//     // Écoutez l'événement 'connect' pour obtenir le socket.id
//     this.socket.on('connect', () => {
//       this.socketId = this.socket.id;
//       console.log('Connecté au serveur Socket.io');
//       console.log("Connecté au serveur chat");
//       console.log("Chat ID : ", this.socket.id);
//     });
//   }
//   onConnect(callback: () => void) {
//     this.socket.on('connect', () => {
//       callback();
//     });
//   }
//   getSocketId() {
//     return this.socketId;
//   }
//   sendMessage(message: any) {
//     this.socket.emit('chat-message', message);
//   }

//   onMessageReceived(callback: (arg0: any) => void) {
//     this.socket.on('chat-message', (message) => {
//       callback(message);
//     });
//   }
// }
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); 
  }

  sendMessage(message: string, messageType: string, targetUserId: string) {
    this.socket.emit('send-message', message, messageType, targetUserId);
  }

  onMessageReceived(callback: (message: any) => void) {
    this.socket.on('chat-message', (message) => {
      callback(message);
    });
  }

  markMessagesAsRead(chatId: string) {
    this.socket.emit('mark-messages-as-read', chatId);
  }
}

