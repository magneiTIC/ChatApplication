import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot)
      {
      let status=sessionStorage.getItem('status');

      var expectedStatus = status;
      if(route.data['expectedStatus']){
        expectedStatus = route.data['expectedStatus']
      }

      // var expectedStatus1 = status;
      // if(route.data['expectedStatus1']){
      //   expectedStatus = route.data['expectedStatus1']
      // }


      if((this.authService.isLoggedIn() ) && (status==expectedStatus)){
        return true
      }
 
      this.router.navigate(['/login']);
    return false;
  }
  
}
