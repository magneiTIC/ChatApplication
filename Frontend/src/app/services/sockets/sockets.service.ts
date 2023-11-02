import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private socketId!: string;
  apiUrl = 'http://localhost:3000';

  constructor() {
    // La connexion socket est initialement établie dans le constructeur, vous pouvez laisser cette partie inchangée.
    this.socket = io(this.apiUrl, {
      query: {
        userId: sessionStorage.getItem("id")
      }
    });

    this.socket.on('connect', () => {
      console.log("Connecté au serveur chat");
      console.log("Chat ID : ", this.socket.id);
    });
  }

  getSocketId() {
    return this.socketId;
  }

  sendMessage(message: string|any , targetUserId: string) {
    this.socket.emit('send-message', message, targetUserId);
  }

  onMessageReceived(callback: (message: any) => void) {
    this.socket.on('chat-message', (message) => {
      console.log("message recu ", message);
      callback(message);
    });
  }

  markMessagesAsRead(chatId: string) {
    this.socket.emit('mark-messages-as-read', chatId);
  }

  // Ajoutez cette méthode pour initialiser la connexion socket après la connexion réussie de l'utilisateur
  initializeSocketConnection() {
    // Fermez la connexion socket existante s'il y en a une
    if (this.socket) {
      this.socket.disconnect();
    }
  
    // Réinitialisez la connexion socket avec le nouvel utilisateur
    this.socket = io(this.apiUrl, {
      query: {
        userId: sessionStorage.getItem("id")
      }
    });

    this.socket.on('connect', () => {
      console.log("Connecté au serveur chat après connexion utilisateur");
      console.log("Chat ID : ", this.socket.id);
    });
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}
