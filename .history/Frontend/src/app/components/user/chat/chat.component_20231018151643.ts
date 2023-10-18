import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs'; // Importez 'of' depuis RxJS
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SocketService } from 'src/app/services/sockets/sockets.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  showDate = true;

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService
  ) {}

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messageControl = new FormControl('');
  currentUserId = sessionStorage.getItem('uid');
  chatId = this.chatsService.selectedChatId;
  messages: Observable<any> = of(null); // Initialisez la propriété 'messages' avec 'of(null)'
  myChats = this.chatsService.getChatsByUser('' + this.currentUserId);

  ngOnInit(): void {
    if (this.chatId) {
      this.messages = this.messagesService.getMessagesByChat('' + this.chatId);
    }
  }

  @ViewChild('endOfChat') endOfChat!: ElementRef;

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
      this.showDate = true;
    } else {
      this.showDate = false;
    }
  }

  formatMessageTime(sentAt: string): string {
    const sentDate = new Date(sentAt);
    return `${sentDate.getHours()}:${sentDate.getMinutes()}`;
  }

  formatMessageDate(sentAt: string): string {
    const sentDate = new Date(sentAt);
    const currentDate = new Date();

    if (sentDate.toDateString() === currentDate.toDateString()) {
      return '';
    } else if (
      sentDate.toDateString() ===
      new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toDateString()
    ) {
      return 'Hier';
    } else {
      return `${sentDate.getDate()}/${sentDate.getMonth() + 1}/${sentDate.getFullYear()}`;
    }
  }

  areDatesEqual(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  sendMessage() {
    const message = this.messageControl.value;
    if (message) {
      this.socketService.sendMessage(message);
      this.messageControl.setValue('');
    }
  }
}
