import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private usersService : UserService,
    private chatService: ChatService
  ) { }

  searchControl=new FormControl();
  // user$=this.usersService.currentUserProfile$;

  //  users$=combineLatest([
  //   this.usersService.allUsers$,
  //   this.users$,
  //   this.searchControl.valueChanges.pipe(startWith(''))])
  //   .pipe(map(([ users,user, searchString])=>users.filter(u=>u.displayName?.to LowerCase().include(searchString.toLowerCase()) && u.uid !==user)));
  users$=[]
  mychats$ =[]
  // mychats$ = this.chatService.myChats$;

 

  
  //  users$=combineLatest([
  //   this.usersService.allUsers$,
  //   this.users$,
  //   this.searchControl.valueChanges.pipe(startWith(''))])
  //   .pipe(map(([ users,user, searchString])=>users.filter(u=>u.displayName?.to LowerCase().include(searchString.toLowerCase()) && u.uid !==user)));








  ngOnInit(): void {
  }

}
