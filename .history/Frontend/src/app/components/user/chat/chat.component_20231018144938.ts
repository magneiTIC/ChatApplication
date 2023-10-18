import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
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
  chatId: string | null = null; // Déclarez chatId
  messages: Observable<any> | undefined; // Déclarez messages

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService
  ) {}

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('endOfChat') endOfChat!: ElementRef;

  messageControl = new FormControl('');
  currentUserId = sessionStorage.getItem('uid');

  ngOnInit(): void {
    // Vous pouvez initialiser chatId ici
    this.chatsService.selectedChatId$.subscribe((chatId) => {
      this.chatId = chatId;
      this.messages = this.messagesService.getMessagesByChat(this.chatId);
    });
  }

  // Le reste de votre code...

  sendMessage() {
    const message = this.messageControl.value;
    if (message) {
      this.socketService.sendMessage(message);
      this.messageControl.setValue('');
    }
  }
}
