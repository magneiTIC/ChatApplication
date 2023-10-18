import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  showDate = true;
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService
  ){
    
  }
  @ViewChild('messageContainer') messageContainer: ElementRef;
  ngOnInit(): void {
    this.messages.subscribe((valeur) => {
      console.log(valeur);
      
    });
  }

  @ViewChild('endOfChat' )endOfChat!: ElementRef ;

  messageControl = new FormControl('');
  currentUserId=sessionStorage.getItem('uid')
  messages=this.messagesService.getMessagesByChat('65242e1ee0c515a70e6e5ab2')
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
      // L'utilisateur a fait défiler vers le haut jusqu'au sommet, vous pouvez charger plus de messages ici si nécessaire.
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
  
  
  sendMessage() {
    const content = this.messageControl.value;
    const chatId = ''
    // this.chatListControl.value[0];
    const user=''
    if (content && chatId) {
      this.chatsService
        .addMessageToChat(chatId, content,user)
        .subscribe(() => {
          this.scrollToBottom();
        });
      this.messageControl.setValue('');
    }
  }
}
