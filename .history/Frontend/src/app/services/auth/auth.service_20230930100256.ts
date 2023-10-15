import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { User } from '../user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: any;

  apiUrl = 'http://localhost:3000'

  constructor(private auth: Auth, private http: HttpClient) { }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signIn(email: string, password: string): Promise<User | null> {
    return new Promise<User | null>(async (resolve, reject) => {
      try {
        // Validez les données dans la partie backend en envoyant une requête HTTP POST.
        this.http.post(this.apiUrl + '/users/login', { email, password }).subscribe(async (response: any) => {
          console.log(response);
          if (response) {
            // Les données sont valides, utilisez Firebase pour authentifier l'utilisateur.
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            console.log("Connexion réussie");
            resolve(userCredential.user);
          } else {
            // Les données ne sont pas valides, gérez l'erreur ici.
            console.error('Données non valides');
            
            resolve(null);
          }
        });
  
      } catch (error) {
        // Gérez les erreurs d'authentification ici.
        console.error('Erreur d\'authentification', error);
        reject(error);
      }
    });
  }
  


  signOut() {
    return signOut(this.auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

}
