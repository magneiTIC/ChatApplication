import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  messageControl = new FormControl('');
  message = [];
  user = '';

  constructor(private socketService: SocketService) {} // Injectez le service SocketService

  ngOnInit() {
    // Écoutez les messages entrants
    this.socketService.onMessageReceived((message) => {
      // Traitez le message reçu ici et ajoutez-le à votre liste de messages
      this.message.push(message);
      // Assurez-vous que la liste de messages est toujours à jour
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  sendMessage() {
    const messageContent = this.messageControl.value;
    if (messageContent !== null && messageContent.trim() !== '') {
      // Émettre le message vers le serveur Socket.io via le service SocketService
      this.socketService.sendMessage({ content: messageContent, user: this.user });
      // Effacer le champ de saisie après l'envoi
      this.messageControl.setValue('');
    }
  }
}
