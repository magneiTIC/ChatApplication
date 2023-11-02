import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {}
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const expectedProfile = route.data['expectedProfile'];
    const expectedProfile0 = route.data['expectedProfile0'];

    if (this.authService.isUserLoggedIn() &&  (await this.authService.hasProfile(expectedProfile) || await this.authService.hasProfile(expectedProfile0))) {
      return true;
    } else {
      this.router.navigate(['/error']); 
      return false;
    }



  }

  
}
