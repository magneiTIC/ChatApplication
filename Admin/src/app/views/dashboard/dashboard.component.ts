import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  constructor(
   private userService: UserService,
  ){}
    nbDirectors:any
    nbAgents:any


  ngOnInit(): void {
    this.userService.countAgents().subscribe((valeur) => {
     this.nbAgents=valeur;
     console.log(valeur);
     
    });

    this.userService.countDirectors().subscribe((valeur) => {
      this.nbDirectors=valeur;
     });

   
  }


  





}
