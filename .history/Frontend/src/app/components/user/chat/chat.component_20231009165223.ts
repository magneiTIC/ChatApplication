import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SocketService } from 'src/app/services/sockets/sockets.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @ViewChild('endOfChat' )endOfChat!: ElementRef ;

  messageControl = new FormControl('')| any;
  message=[]
  user=''
  socket: any;
  
  scrollToBottom(){
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
   
  
  
  sendMessage() {
    const messageContent = this.messageControl.value | any ;
    if (messageContent.trim() !== '') {
      // Émettre le message vers le serveur Socket.io
      this.socket.emit('chat-message', { content: messageContent, user: this.user });
      // Effacer le champ de saisie après l'envoi
      this.messageControl.setValue('');
    }
  }
  
}
