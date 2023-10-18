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
export class ChatComponent implements OnInit{

  showDate = true;
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private socketService: SocketService
  ){
    
  }
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  ngOnInit(): void {
    // this.messages.subscribe((valeur) => {
    //   console.log(valeur);
    console.log("chat id dans chat.ts"+chatid)
    // });
  }

  @ViewChild('endOfChat' )endOfChat!: ElementRef ;

  messageControl = new FormControl('');
  currentUserId=sessionStorage.getItem('uid')
  chatId = this.chatsService.selectedChatId ;
  //messages=this.messagesService.getMessagesByChat('this.chatId)
  myChats=this.chatsService.getChatsByUser(''+this.currentUserId)



  scrollToBottom(){
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
  formatMessageTime(sentAt: string): string {
    const sentDate = new Date(sentAt);
    return `${sentDate.getHours()}:${sentDate.getMinutes()}`;
  }
  
  formatMessageDate(sentAt: string): string {
    const sentDate = new Date(sentAt);
    const currentDate = new Date();
  
    if (sentDate.toDateString() === currentDate.toDateString()) {
      // Aujourd'hui : afficher l'heure uniquement
      return '';
    } else if (
      sentDate.toDateString() === new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toDateString()
    ) {
      // Hier : afficher "Hier"
      return 'Hier';
    } else {
      // Date antérieure à hier : afficher la date sans l'heure
      return `${sentDate.getDate()}/${sentDate.getMonth() + 1}/${sentDate.getFullYear()}`;
    }
  }
  areDatesEqual(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Comparez les années, les mois et les jours
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  
  
  // sendMessage() {
  //   const content = this.messageControl.value;
  //   const chatId = ''
  //   // this.chatListControl.value[0];
  //   const user=''
  //   if (content && chatId) {
  //     this.chatsService
  //       .addMessageToChat(chatId, content,user)
  //       .subscribe(() => {
  //         this.scrollToBottom();
  //       });
  //     this.messageControl.setValue('');
  //   }
  // }
  sendMessage() {
    const message = this.messageControl.value;
    if (message) {
      this.socketService.sendMessage(message);
      this.messageControl.setValue(''); // Réinitialisez la valeur du champ de message après l'envoi.
    }
  }
}
