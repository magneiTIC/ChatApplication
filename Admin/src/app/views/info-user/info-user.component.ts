import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css']
})
export class InfoUserComponent implements OnInit {

  userUid: string | null = null;
  user:any

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ){}

  
  ngOnInit(): void {
    this.userUid = this.route.snapshot.paramMap.get('uid');
    console.log(this.userUid)

    this.userService.getAgent(''+this.userUid).subscribe((valeur) => {
      console.log(valeur);
     });

     this.userService.getAgent('' + this.userUid).subscribe((userData) => {
      this.user = userData;
    });
  }
  // user=this.userService.getAgent(''+this.userUid)
  
}
