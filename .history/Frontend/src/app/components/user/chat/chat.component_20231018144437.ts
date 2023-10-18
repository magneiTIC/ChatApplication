import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SocketService } from 'src/app/services/sockets/sockets.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: './chat.component.css'
})
export class ChatComponent implements OnInit {

  showDate = true;
  selectedChatId: string | null = null;

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService
  ) {}

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  messageControl = new FormControl('');
  currentUserId = sessionStorage.getItem('uid');
  messages: any[] = [];

  ngOnInit(): void {
    this.chatsService.selectedChatId$.subscribe((chatId) => {
      this.selectedChatId = chatId;
      this.loadMessages();
    });
  }

  loadMessages() {
    if (this.selectedChatId) {
      this.messagesService.getMessagesByChat(this.selectedChatId).subscribe((messages) => {
        this.messages = messages;
        this.scrollToBottom();
      });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.scrollTop === 0) {
      // L'utilisateur a fait défiler vers le haut jusqu'au sommet
      // Vous pouvez charger plus de messages ici si nécessaire.
      this.showDate = true; // Afficher la date lors du défilement vers le haut
    } else {
      this.showDate = false; // Masquer la date lors du défilement vers le bas
    }
  }

  sendMessage() {
    const message = this.messageControl.value;
    if (message && this.selectedChatId) {
      this.socketService.sendMessage(message);
      this.chatsService.addMessageToChat(this.selectedChatId, this.currentUserId, message).subscribe(() => {
        this.messageControl.setValue(''); // Réinitialisez la valeur du champ de message après l'envoi.
      });
    }
  }
}
