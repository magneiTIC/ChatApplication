import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable,of } from 'rxjs'; // Importez 'Observable' depuis RxJS
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SocketService } from 'src/app/services/sockets/sockets.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  showDate = true;
  chat: { chatId: string|null; username: string|null } = { chatId :null, username:null };
  chatId: string | null = null;
  activeChat: string | null | undefined;
  currentUserID: any;
  

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService,
    private authService:AuthService
  ) {}

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messageControl = new FormControl('');
  currentUserUid = sessionStorage.getItem('uid');
  messages: Observable<any[]> = of([])
 

  ngOnInit(): void {
    
    this.chatsService.selectedChat$.subscribe((chat) => {
      // console.log("Selected chat object:", chat);
      if (chat.chatId !== null && chat.username !== null) {
        this.chat = chat;
        this.chatId = chat.chatId;
        // console.log("chat id dans chat component: " + this.chatId);
        if (this.chatId) {
          this.messages = this.messagesService.getMessagesByChat('' + this.chatId);
         
        }
      }
    });
    this.getCurrentUserId();
    
    
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
  
  
  areDatesEqual(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.toDateString() === d2.toDateString();
  }

  sendMessage() {
    const message = this.messageControl.value;
    
    if (message && this.activeChat) {
      // Utilisez l'activeChat pour récupérer le targetUserId
      const targetUserId = "65173d7c19f8f5cb44cbefc2"
  
      if (targetUserId) {
        this.chatsService.addMessageToChat(this.chatId!, this.currentUserID, message, 'text')
          .subscribe((response: any) => {
            // Ici, vous pouvez extraire des informations supplémentaires de la réponse
            // si nécessaire
  
            // Réinitialisez le champ de message après l'envoi
            this.messageControl.setValue('');
          });
      } else {
        console.error("Impossible de trouver le targetUserId pour cette discussion.");
      }
    }
  }
  
  async getCurrentUserId() {
    try {
      
      const userId = await this.authService.getCurrentUserIdByUid(this.currentUserUid!);
      this.currentUserID = userId;
      //console.log("user id in chat component: ", this.currentUserID);
      sessionStorage.setItem("id", userId);
    } catch (error) {
      console.error("Une erreur s'est produite : ", error);
    }
  }
  
  
}
