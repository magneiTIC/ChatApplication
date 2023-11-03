import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import {
  combineLatest,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  @ViewChild('endOfChat' )endOfChat!: ElementRef ;
  chatId: string | null | undefined;

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


    console.log(this.myChats)
    this.myChats.subscribe((valeur) => {
      console.log(valeur);
      const chatIds: string[] = valeur.map((chat: any) => chat._id);
      console.log("chatIds",chatIds);

    });
  }
  
  messageControl = new FormControl('');
  searchControl = new FormControl('');

  currentUserId: string = sessionStorage.getItem('uid') || '';
  
  // myChats=this.chatsService.getChatsByUser('this.currentUserId')
  myChats=this.chatsService.getChatsByUser(''+this.currentUserId);
  
  

  users=this.usersService.getAllUsersInSameDivision() ;


  

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
