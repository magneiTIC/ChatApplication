import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable,map,mergeMap,of, scan, take, tap } from 'rxjs'; // Importez 'Observable' depuis RxJS
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SocketService } from 'src/app/services/sockets/sockets.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  showDate = true;

  chat: { chatId: string|null; username: string|null } = { chatId :null, username:null };
  chatId: string | null = null;
  currentUserID: any;
  

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService,
    private authService:AuthService,
    private elementRef: ElementRef

  ) {}

  @ViewChild('EndOfChat') EndOfChat!: ElementRef;

  endOfChat!: ElementRef;
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
          this.messages$ = this.messagesService.getMessagesByChat('' + this.chatId).pipe( tap(() => {
            this.scrollToBottom();
          })
        );;
          console.log("selected chat",this.chatId)
          
        }
      }
    });

    this.getCurrentUserId();
    this.listenForMessages()
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
      this.showDate = true;
    } else {
      this.showDate = false;
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
                  .subscribe(
                    (addedMessage) => {
                    // Le message a été ajouté à la base de données.
                    console.log("Message ajouté à la base de données:", addedMessage);
                    this.listenForMessages()
                    this.messageControl.reset();
                    this.scrollToBottom();
                   },
                  );
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
      // Assurez-vous que vous avez une valeur de chatId correcte avant de demander les messages.
      if (this.chatId) {
        this.messagesService.getMessagesByChat('' + this.chatId).subscribe((messages: any[]) => {
          // Mise à jour de la liste des messages avec les nouveaux messages reçus via le socket.
          console.log("listen for messages", messages);
          this.messages$ = this.messages$ ? this.messages$.pipe(mergeMap(existingMessages => of([...existingMessages, ...messages]))): of(messages);
        });
      } 
    });
  }
  markMessagesAsRead(chatId: string) {
    console.log('mark message as read ',chatId);
    
    this.socketService.markMessagesAsRead(chatId);
  }
  
  
  sendFile(file: File) {
    if (file) {
      console.log("file",file)
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
              const targetUserId = targetChat.users[0]._id;
  
              if (targetUserId) {
                // Créez un objet FormData pour envoyer le fichier
                const formData = new FormData();
                formData.append('data', file);
                formData.append('contentType',file.type)
                
  
                // Ici, vous pouvez envoyer le fichier via le socket.
                this.socketService.sendMessage(formData, targetUserId);
                // Une fois que le message a été envoyé via le socket, ajoutez-le à la base de données
                this.chatsService
                  .addMediaToChat(targetChat.chatId, this.currentUserID,{'data': file.name,'contentType':file.type},"file")
                  .subscribe((addedMessage) => {
                    // Le message a été ajouté à la base de données.
                    console.log("document ajouté à la base de données:", addedMessage);
                    this.listenForMessages()
                    this.messageControl.reset();
                  });
              } else {
                console.error("Le targetUserId est indéfini, impossible d'envoyer le fichier.");
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

 
  
  
  onFileSelected(event: any) {
    const file = event.target.files[0]; // Récupérez le fichier sélectionné
  
    // Appelez la méthode sendFile avec le fichier sélectionné
    this.sendFile(file);
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
