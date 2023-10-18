import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable,of } from 'rxjs'; // Importez 'Observable' depuis RxJS
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
  chatId: string | null = null;

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService,


  ) {}

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messageControl = new FormControl('');
  currentUserId = sessionStorage.getItem('uid');
  messages: Observable<any[]> = of([])

  ngOnInit(): void {
    this.chatsService.selectedChatId$.subscribe((chatId) => {
      this.chatId = chatId;
      console.log("chat id dans chat component: " + this.chatId);
      if (this.chatId) {
        this.messages = this.messagesService.getMessagesByChat('' + this.chatId);
      }
    });
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.scrollTop === 0) {
      this.showDate = true;
    } else {
      this.showDate = false;
    }
  }

  scrollToBottom(): void {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement as HTMLElement;
      if (element.scrollTop === 0) {
        this.showDate = true;
      } else {
        this.showDate = false;
      }
    }
  }

  formatMessageTime(sentAt: string): string {
    const sentDate = new Date(sentAt);
    return sentDate.toLocaleTimeString();
  }

  formatMessageDate(sentAt: string): string {
    const sentDate = new Date(sentAt);
    return sentDate.toLocaleDateString();
  }

  // sendMessage() {
  //   const message = this.messageControl.value;
  //   this.socketService.sendMessage(message);
  //   this.messageControl.setValue('');
  // }

  areDatesEqual(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  }
}
