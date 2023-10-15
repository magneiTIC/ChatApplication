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
            async onSubmit() {
              try {
                if (this.loginForm.invalid) {
                  console.log('Formulaire invalide');
                  this.validationError = true;
                  alert('Le formulaire est invalide. Veuillez remplir tous les champs correctement.');
                  return;
                }
            
                const email = this.loginForm.value.email;
                const password = this.loginForm.value.password;
            
                const result = await this.authService.signIn(email, password);
                console.log("Result", result);
                if (result) {
                  this.router.navigate(['/test']);
                } else {
                  // Authentification échouée, définissez connexionError sur true.
                  this.connexionError = true;
                }
              } catch (error) {
                console.error('Erreur lors de la connexion :', error);
                alert('Une erreur s\'est produite lors de la connexion. Veuillez réessayer plus tard.');
              }
            }
            
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
