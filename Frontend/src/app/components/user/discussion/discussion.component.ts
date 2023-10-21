import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css']
})
export class DiscussionComponent implements OnInit {
  @ViewChild('endOfChat' )endOfChat!: ElementRef ;
  chatId: string | null | undefined;
  
  // selectedChatId: string | null = null;
  constructor( 
    private chatsService: ChatsService,
    private usersService : UsersService,
    private messagesService: MessagesService
    ){

  
  }
  selectChat(chatId: string, username: string) {
    this.chatsService.selectedChat(chatId, username);
  }

  ngOnInit(): void {
    this.chatsService.selectedChat$.subscribe((chat) => {
      
      this.chatId = chat.chatId;
      // console.log("Selected chat ID:", this.chatId);
    });
  }
  
  messageControl = new FormControl('');
  searchControl = new FormControl('');

  currentUserUid: string = sessionStorage.getItem('uid') || '';
  
  // myChats=this.chatsService.getChatsByUser('this.currentUserId')
  myChats=this.chatsService.getChatsByUser(''+this.currentUserUid);
  
  

  //messages=this.messagesService.getLastMessage('6526c83d0c3649b5dd64e210')
  users=this.usersService.getAllUsersInSameDivision() ;

  // users$ = combineLatest([
  //   this.users,
  //   this.searchControl.valueChanges.pipe(startWith('')),
  // ]).pipe(
  //   map(([users, searchString]) => {
  //     return users.filter((u) =>
  //       u.displayName?.toLowerCase().includes(searchString.toLowerCase())
  //     );
  //   })
  // );
  

  scrollToBottom(){
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
   
  
  
  sendMessage(){

  }

}
