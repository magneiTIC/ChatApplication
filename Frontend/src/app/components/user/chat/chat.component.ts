import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable,map,of, scan, take } from 'rxjs'; // Importez 'Observable' depuis RxJS
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
  messages$: Observable<any[]> = of([]);

 

  ngOnInit(): void {
    
    
    this.chatsService.selectedChat$.subscribe((chat) => {
      // console.log("Selected chat object:", chat);
      if (chat.chatId !== null && chat.username !== null) {
        this.chat = chat;
        this.chatId = chat.chatId;
        // console.log("chat id dans chat component: " + this.chatId);
        if (this.chatId) {
          this.messages$ = this.messagesService.getMessagesByChat('' + this.chatId);
          console.log("selected chat",this.chatId)
          
        }
      }
    });
    this.getCurrentUserId();
    this.listenForMessages()
    
    
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
  
    if (message) {
      this.chatsService.getActiveChat().subscribe((activeChat) => {
        if (activeChat) {
          const chatId = activeChat.chatId;
  
          this.chatsService.getChatsByUser("" + this.currentUserUid).subscribe((chats: any[]) => {
            let targetChat: any = null;
  
            chats.forEach((chat) => {
              if (chat.chatId === chatId) {
                targetChat = chat;
              }
            });
  
            if (targetChat) {
              // Ici, vous pouvez utiliser les données du targetChat, par exemple, pour obtenir l'ID du destinataire.
              const targetUserId = targetChat.users[0]._id;
  
              if (targetUserId) {
                console.log("message dans targetuserid", message);
                console.log("id sender", this.currentUserID);
  
                // Envoi du message via le socket
                this.socketService.sendMessage(message, targetUserId);
  
                // Une fois que le message a été envoyé via le socket, ajoutez-le à la base de données
                this.chatsService
                  .addMessageToChat(targetChat.chatId, this.currentUserID, message, "text")
                  .subscribe((addedMessage) => {
                    // Le message a été ajouté à la base de données.
                    console.log("Message ajouté à la base de données:", addedMessage);
                    this.listenForMessages()
                    this.messageControl.reset();
                  });
              } else {
                console.error("Le targetUserId est indéfini, impossible d'envoyer le message.");
              }
            } else {
              console.error("Discussion correspondant au chatId non trouvée.");
            }
          });
        } else {
          console.error("Aucun chat actif sélectionné.");
        }
      });
    }
  }
  private listenForMessages() {
    this.socketService.onMessageReceived((message: any) => {
      // À chaque réception d'un nouveau message via le socket, appelez la méthode pour récupérer les messages de la conversation
      this.messagesService.getMessagesByChat('' + this.chatId).subscribe((messages: any[]) => {
        // Mettez à jour la liste des messages avec les nouveaux messages
        console.log("listen for messages",messages)
        this.messages$ = of(messages);
      });
    });
  }
  markMessagesAsRead(chatId: string) {
    console.log('mark message as read ',chatId);
    
    this.socketService.markMessagesAsRead(chatId);
  }
  
  
  attachFile(){}
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
