import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
type SortedChats = { [key: string]: any[] };

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit{
  @ViewChild('endOfChat' )endOfChat!: ElementRef ;
  chatId: string | null | undefined;
  groupedChats: any;

  constructor( 
    private usersService : UsersService,
    private chatsService: ChatsService,
    ){ 

     }

    selectChat(chatId: string, username: string) {
      this.chatsService.selectedChat(chatId, username);
    }
  
    ngOnInit(): void {
      this.chatsService.selectedChat$.subscribe((chat) => {
        
        this.chatId = chat.chatId;
      });

      this.myChats.subscribe((chats: any) => {
        this.sortedChats = this.sortChatsByFirstLetter(chats);
      });


    }
    currentUserUid: string = sessionStorage.getItem('uid') || '';
    myChats=this.chatsService.getChatsByUser(''+this.currentUserUid);
  
    users=this.usersService.getAllUsersInSameDivision() ;


    sortedChats: SortedChats = {};
    sortChatsByFirstLetter(chats: any) {
      const sortedChats: any = {};
      chats.forEach((chat: any) => {
        const firstLetter = chat.users[0].username.charAt(0).toUpperCase();
        if (!sortedChats[firstLetter]) {
          sortedChats[firstLetter] = [];
        }
        sortedChats[firstLetter].push(chat);
      });
      return sortedChats;
    }
  }




  
  
  
  

  















