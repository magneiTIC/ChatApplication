import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userList: any[] = []; // Déclarez une variable pour stocker la liste d'utilisateurs

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
   // Récupérez la liste des utilisateurs partageant la même division
   this.userService.getAllUsersInSameDivision().subscribe(
    (data: any) => {
      this.userList = data; // Stockez les données dans la variable userList
    },
    (error) => {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
    }
  );
  }
  

}
