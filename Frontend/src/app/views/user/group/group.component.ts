import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
type SortedChats = { [key: string]: any[] };
type SortedDivisions = { [key: string]: any[] };


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {

  chatId: any;
  constructor( 
    private usersService : UsersService,
    private chatsService: ChatsService,
    ){ 

     }

    selectChat(chatId: string, username: string,sharedKey:string) {
      this.chatsService.selectedChat(chatId, username,sharedKey);
    }
  
    ngOnInit(): void {
      this.myChats.subscribe((chats: any) => {
        console.log('mychats dans groupe',chats)
        
      });
      this.chatsService.selectedChat$.subscribe((chat) => {
        
        this.chatId = chat.chatId;
      });

      this.divisions.subscribe((division: any) => {
        this.sortedDivisions = this.sortDivisionsByFirstLetter(division);

      });

      this.myChats.subscribe((chats: any) => {
        console.log('mychats 2',chats);

        this.sortedChats = this.sortChatsByFirstLetter(chats);
        console.log('sorted',this.sortedChats)
      });

    }
    div=sessionStorage.getItem('division')
    currentUserUid: string = sessionStorage.getItem('uid') || '';
    myChats=this.usersService.contactsByDivision(''+this.currentUserUid);
  
    divisions=this.usersService.getAllDivisions() ;

    users=this.usersService.listContactsInSameDivision(''+this.currentUserUid)
    sortedDivisions: SortedDivisions = {};
    sortDivisionsByFirstLetter(divisions: any) {
      const sortedDivisions: any = {};
      divisions.forEach((division: any) => {
        console.log(divisions);
        const firstLetter = division.charAt(0).toUpperCase();
        if (!sortedDivisions[firstLetter]) {
          sortedDivisions[firstLetter] = [];
        }
        sortedDivisions[firstLetter].push(division);
      });
      return sortedDivisions;
    }

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
