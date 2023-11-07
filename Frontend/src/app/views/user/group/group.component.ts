import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatsService } from 'src/app/services/chats/chats.service';
import { UsersService } from 'src/app/services/users/users.service';
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
      this.chatsService.selectedChat$.subscribe((chat) => {
        
        this.chatId = chat.chatId;
      });

      this.divisions.subscribe((division: any) => {
        this.sortedDivisions = this.sortDivisionsByFirstLetter(division);
        console.log(this.divisions);

      });


    }
    currentUserUid: string = sessionStorage.getItem('uid') || '';
    myChats=this.usersService.contactsByDivision(''+this.currentUserUid);
  
    divisions=this.usersService.getAllDivisions() ;


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
  }
