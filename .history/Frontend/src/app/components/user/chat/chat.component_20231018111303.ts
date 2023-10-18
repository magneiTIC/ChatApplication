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

  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService
  ){
    
  }
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
