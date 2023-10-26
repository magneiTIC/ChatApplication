import { Component,OnInit} from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-director',
  templateUrl: './list-director.component.html',
  styleUrls: ['./list-director.component.css']
})
export class ListDirectorComponent implements OnInit   {

  constructor(
    private userService:UserService
  ){}
  ngOnInit(): void {
  }


  directors=this.userService.getAllDirectors() ;
}
