import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
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
    ){ 

     }
users: any[] = []; // Assurez-vous que le type correspond aux données de votre service
groupedUsers: Map<string, any[]> = new Map();
    //  users=this.usersService.getAllUsersInSameDivision() ;
     
  ngOnInit(): void {
    this.usersService.getAllUsersInSameDivision().subscribe((data: any[]) => {
      // Triez les utilisateurs par ordre alphabétique
      this.users = data.sort((a, b) => (a.username > b.username) ? 1 : -1);
    
  })


}

  
  
  }
  

  















