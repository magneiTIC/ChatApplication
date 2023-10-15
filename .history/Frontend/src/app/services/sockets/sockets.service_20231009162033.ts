import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  apiUrl = 'http://localhost:3000'
  constructor() {
    this.socket = io(api); // Remplacez par l'URL de votre serveur Socket.io
  }

  sendMessage(message) {
    this.socket.emit('chat-message', message);
  }

  onMessageReceived(callback) {
    this.socket.on('chat-message', (message) => {
      callback(message);
    });
  }
}