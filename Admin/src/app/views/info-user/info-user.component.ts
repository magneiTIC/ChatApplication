import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {
  constructor(
    private userService: UserService
  ){}
  ngOnInit(): void {
    this.user.subscribe((valeur) => {
      console.log(valeur);
     });
  }
  user=this.userService.getUser('hRpMyoB2XuNx4mFWqTm5vo3nmWU2')
}
