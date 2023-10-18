import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit{
  @ViewChild('endOfChat' )endOfChat!: ElementRef ;

  constructor( 
    private usersService : UsersService,
    ){  }

  ngOnInit(): void {
  }
  
  users=this.usersService.getAllUsersInSameDivision() ;

}
