import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private socketId!: string;
  apiUrl = 'http://localhost:3000';

  constructor(
    private messagesService:MessagesService

  ) {
    
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

  sendMessage(message: string|any , targetUserId: string,sharedKey: string, chatId: string, user: string, type: string) {
    this.socket.emit('send-message', message, targetUserId,sharedKey,chatId,user,type);
  }
  
  // sendFile(data: any,targetUserId:string) {
  //   this.socket.emit('sent-file', data,targetUserId);
  // }

  onMessageReceived(callback: (decryptedMessage: any) => void) {
    this.socket.on('chat-message', (encryptedMessage) => {
      console.log("message recu ", encryptedMessage);
      //const decryptedMessage= this.messagesService.decryptionMessage(encryptedMessage,encryptedSharedKey)
      callback(encryptedMessage);
    });
  }
  // onFileReceived(callback: (data: any) => void) {
  //   this.socket.on('file-received', (data)=>{
  //     console.log("fichier reçu", data);
  //     callback(data)
  //   });
  // }

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
