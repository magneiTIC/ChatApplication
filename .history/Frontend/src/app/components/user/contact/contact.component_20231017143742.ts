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
import { Chat } from 'src/app/models/chat';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  @ViewChild('endOfChat' )endOfChat!: ElementRef ;

  constructor( 
    private chatsService: ChatsService,
    private usersService : UsersService,
    private messagesService: MessagesService
    ){

  
  }
  ngOnInit(): void {
    console.log(this.myChats)
    this.myChats.subscribe((valeur) => {
      console.log(valeur);
      const chatIds: string[] = valeur.map((chat: any) => chat._id);
      console.log("chatIds",chatIds);

      this.myChats
      .pipe(
        switchMap((chats) => {
          // Pour chaque chat, récupérez le dernier message
          const observables = chats.map((chat) =>
            this.messagesService.getLastMessage(chat._id)
          );

          // Utilisez combineLatest pour obtenir les résultats de manière parallèle
          return combineLatest(observables);
        })
      )
      .subscribe((messages) => {
        // Messages contiendra les derniers messages pour chaque chat
        console.log(messages);
      });
    });
  }
  
  messageControl = new FormControl('');
  searchControl = new FormControl('');

  currentUserId=sessionStorage.getItem('uid')
  // myChats=this.chatsService.getChatsByUser('this.currentUserId')
  myChats=this.chatsService.getChatsByUser(''+this.currentUserId);
  
  

  messages=this.messagesService.getLastMessage('6526c83d0c3649b5dd64e210')
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
