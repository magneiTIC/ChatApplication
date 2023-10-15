import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  apiUrl = 'http://localhost:3000'
  constructor() {
    this.socket = io(this.apiUrl); 
    socket.on('connect', () => {
      console.log("Connecté au serveur chat");
      console.log("Chat ID : ", socket.id);
      readMessage();
  });
  }

  sendMessage(message: any) {
    this.socket.emit('chat-message', message);
  }

  onMessageReceived(callback: (arg0: any) => void) {
    this.socket.on('chat-message', (message) => {
      callback(message);
    });
  }
}