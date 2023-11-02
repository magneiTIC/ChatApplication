import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit{

  
  constructor(private authService: AuthService, private auth: Auth, private router: Router) { }
  ngOnInit(): void {
console.log(this.profile);
  }


profile=sessionStorage.getItem('profil');

logout() {
  this.authService.logout();
  this.auth.signOut();
  this.alert();
  this.router.navigate(['login']);

}

alert() {
  Swal.fire({
    icon: 'success',
    title: 'Bye Bye !',
    showConfirmButton: false,
    timer: 1000,
  });
}

}
