import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000'

  constructor(private auth: Auth, private http: HttpClient) { }

  // Connexion d'un utilisateur avec email et mot de passe
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      // Connexion réussie
      const user = userCredential.user;
      console.log('Utilisateur connecté :', user);

      // Vérifiez si l'utilisateur a déjà réinitialisé son mot de passe
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        console.log('L\'utilisateur doit réinitialiser son mot de passe à la première connexion.');
   
        // Stockez cette information dans le stockage local du navigateur
        localStorage.setItem('mustResetPassword', 'true');

        // Garder la session 
        sessionStorage.setItem('uid', user.uid);

      } else {
        // Stockez le jeton d'identification de l'utilisateur pour les requêtes ultérieures à Express
        const idToken = await user.getIdToken();
        console.log('Jeton d\'identification :', idToken);

        // Envoie le jeton d'identification à votre serveur Express
        this.sendTokenToExpress(idToken);
      }

      return userCredential;
    } catch (error) {
      // Gérer les erreurs de connexion
      console.error('Erreur de connexion :', error);
      throw error; // Rejeter l'erreur pour que le code appelant puisse la gérer si nécessaire
    }
  }

  // Enregistrement d'un nouvel utilisateur avec email et mot de passe
  // Inscription avec e-mail et mot de passe
  async signUp(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  // Envoie le jeton d'identification à Express
  private sendTokenToExpress(idToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`
    });

    this.http.post(`${this.apiUrl}/admin/create-user`, null, { headers })
      .subscribe(
        () => {
          console.log('Jeton d\'identification envoyé à Express avec succès.');
        },
        (error) => {
          console.error('Erreur lors de l\'envoi du jeton d\'identification à Express :', error);
        }
      );
  }

}
