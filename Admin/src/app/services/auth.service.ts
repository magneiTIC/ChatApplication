import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000'

  constructor(private auth: Auth, private http: HttpClient) { }

  authenticate(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth,email, password);
  }
 
  async hasProfile(profile: string) {
    const userId = sessionStorage.getItem('uid');
    return this.http.get(`${this.apiUrl}/users/${userId}/checkUserProfile`).toPromise()
      .then((response: any) => {
        if (response && response.profile === profile) {
          sessionStorage.setItem('profile', profile);
          return true;
        } else {
          return false;
        }
      })
      .catch((error: any) => {
        console.error('Erreur lors de la vérification du profil :', error);
        return false;
      });
  }

  isUserLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  addDirector() {}
}
