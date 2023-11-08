import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, mergeMap, of, scan, take, tap } from 'rxjs'; // Importez 'Observable' depuis RxJS
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { SocketService } from 'src/app/services/sockets/sockets.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as CryptoJS from 'crypto-js';
import { MatDialog } from '@angular/material/dialog';
import { FileViewerDialogComponent } from '../../file-viewer-dialog/file-viewer-dialog.component';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  showDate = true;
  chat: { chatId: string | null; username: string | null; sharedKey: string | null } = { chatId: null, username: null, sharedKey: null };
  chatId: string | null = null;
  currentUserID: any;
  selectedFile: File | undefined;
  sharedKey: string | null = null;


  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService,
    private authService: AuthService,
    private dialog:MatDialog,

  ) { // Écoutez l'événement de capture d'écran
    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        console.log("tentative de capture d'ecran")
        applyBlackout();
      }
    });
  }

  @ViewChild('messageContainer') messageContainer!: ElementRef;
  messageControl = new FormControl('');
  currentUserUid = sessionStorage.getItem('uid');
  messages$: Observable<any[]> = of([]);
  isPopupVisible = false;
  popupFileUrl: string | undefined;
  
  openFileViewerDialog(fileUrl: string) {
    this.dialog.open(FileViewerDialogComponent, {
      data: { fileUrl }, // Passer le contenu du fichier
      width:'80%',
      height:'80%'
    });
  }
  // openPopup(fileUrl: string) {
  //   this.isPopupVisible = true;
  //   this.popupFileUrl = fileUrl;
  // }

  // openDialog(fileRelativePath: string): void {
  //   const dialogRef = this.dialog.open(FileViewerComponent, {
  //     data: {
  //       getFullFileUrl: this.getFullFileUrl.bind(this), // Pass the getFullFileUrl function
  //       fileRelativePath,
  //     },
  //   });
  // }

  closePopup() {
    this.isPopupVisible = false;
    this.popupFileUrl = '';
  }
  openPopup(fileUrl: string) {
    const width = 800;
    const height = 600;

    // Ouvrez la fenêtre popup
    const popupWindow = window.open(fileUrl, 'Popup', `width=${width}, height=${height}`);

  }

  getFullFileUrl(relativePath: string): string {
    const BASE_URL = 'http://localhost:3000';

    return `${BASE_URL}/uploads/${relativePath}`;
  }

  ngOnInit(): void {
    this.chatsService.selectedChat$.subscribe((chat) => {
      if (chat.chatId !== null && chat.username !== null) {
        this.chat = chat;
        this.chatId = chat.chatId;
        this.sharedKey = chat.sharedKey;
        console.log("sharedKey dans chat component: " + this.sharedKey);
        if (this.chatId) {
          // Adjust the page and pageSize values as needed
          this.messages$ = this.messagesService.getMessagesByChat('' + this.chatId, 1, 10);
          this.messages$.subscribe((messages: any[]) => {
            // Do something with each message, for example:
            console.log(messages);
          });
          this.markMessagesAsRead(this.chatId)
        }
      }
    });
    this.getCurrentUserId();
    this.listenForMessages();
    this.loadMessages()
    this.scrollToBottom()
    
  }

  onScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (element.scrollTop === 0) {
      this.showDate = true;
    } else {
      this.showDate = false;
    }
  }

  // scrollToBottom(): void {
  //   if (this.messageContainer) {
  //     const element = this.messageContainer.nativeElement as HTMLElement;
  //     if (element.scrollTop === 0) {
  //       this.showDate = true;
  //     } else {
  //       this.showDate = false;
  //     }
  //   }
  // }

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
                console.log('target chat', targetChat)
              }
            });
            if (targetChat) {
              // Ici, vous pouvez utiliser les données du targetChat, par exemple, pour obtenir l'ID du destinataire.
              const targetUserId = targetChat.users[0]._id;
              const sharedKey = targetChat.sharedKey
              const chatId = targetChat.chatId
              //console.log(`sharedKey: ${sharedKey}`);
              if (targetUserId) {
                console.log("message dans targetuserid", message);
                console.log("id sender", this.currentUserID);
                // Envoi du message via le socket
                this.socketService.sendMessage(message, targetUserId, sharedKey, chatId, this.currentUserID, 'text');
                //this.listenForMessages()
                //this.loadMessages()
                this.messageControl.reset();
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
    this.socketService.onMessageReceived((encryptedMessage: any) => {
      if (this.chatId) {
        this.messagesService.getMessagesByChat('' + this.chatId, 1, 10).subscribe((newMessages: any[]) => {
          console.log("listen for messages", newMessages);
          this.messages$ = this.messages$ ? this.messages$.pipe(
            map(existingMessages => [...newMessages, ...existingMessages])
          ) : of(newMessages);
          this.scrollToBottom();
        });
      }
    });
  }

  private listenForFiles() {
    this.socketService.onFileReceived((encryptedMessage: any) => {
      if (this.chatId) {
        this.messagesService.getMessagesByChat('' + this.chatId, 1, 10).subscribe((newMessages: any[]) => {
          console.log("listen for messages", newMessages);
          this.messages$ = this.messages$ ? this.messages$.pipe(
            map(existingMessages => [...newMessages, ...existingMessages])
          ) : of(newMessages);
          this.scrollToBottom();
        });
      }
    });
  }
  
  private loadMessages() {
    if (this.chatId) {
      this.messagesService.getMessagesByChat('' + this.chatId, 1, 10)
        .subscribe((messages: any[]) => {
          this.messages$ = of(messages);
          this.scrollToBottom();
        });
    }
  }
  scrollToBottom(): void {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement as HTMLElement;
      element.scrollTop = element.scrollHeight;
    }
  }
    


  markMessagesAsRead(chatId: string) {
    console.log('mark message as read ', chatId);
    this.socketService.markMessagesAsRead(chatId,this.currentUserID);
  }


  sendFile(file: File) {
    if (file) {
      console.log("file", file);

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
              const sharedKey = targetChat.sharedKey
              const chatId = targetChat.chatId
              console.log("chat id wesh :", chatId);

              if (targetUserId) {
                const formData = new FormData();
                formData.append('chatId', targetChat.chatId);
                formData.append('user', this.currentUserID);
                formData.append('media', file);
                formData.append('type', 'file'); // Set the type to 'file'

                this.socketService.sendFile(formData, targetUserId);

                this.chatsService.addMediaToChat(targetChat.chatId, this.currentUserID, file, 'file') // Provide 'file' as the type
                  .subscribe((addedMessage) => {
                    console.log("Document added to the database:", addedMessage);
                   this.listenForFiles();
                    this.messageControl.reset();
                  });
                 } else {
                console.error("The targetUserId is undefined, unable to send the file.");
              }
            } else {
              console.error("No chat corresponding to the chatId found.");
            }
          });
        } else {
          console.error("No active chat selected.");
        }
      });
    }
  }


  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      // Appelez la méthode sendFile avec le fichier sélectionné
      this.sendFile(this.selectedFile);
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
// Fonction pour appliquer un masque noir
function applyBlackout() {
  // Créez un élément div pour le masque noir
  var blackoutDiv = document.createElement('div');
  blackoutDiv.style.position = 'fixed';
  blackoutDiv.style.top = '0';
  blackoutDiv.style.left = '0';
  blackoutDiv.style.width = '100%';
  blackoutDiv.style.height = '100%';
  blackoutDiv.style.backgroundColor = 'black';
  blackoutDiv.style.zIndex = '9999';

  // Ajoutez le masque noir à la page
  document.body.appendChild(blackoutDiv);

  // Supprimez le masque noir après un certain délai
  setTimeout(function () {
    document.body.removeChild(blackoutDiv);
  }, 3000); // Par exemple, supprimez le masque après 3 secondes
}

