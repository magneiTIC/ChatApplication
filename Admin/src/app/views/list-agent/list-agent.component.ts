import { Component,OnInit} from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.css']
})
export class ListAgentComponent  implements OnInit{
  ngOnInit(): void {
  }

  constructor(
    private userService: UserService
  ){}
  agents=this.userService.getAllAgents()
}
