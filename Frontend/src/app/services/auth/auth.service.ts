import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  // Méthode de connexion par e-mail/mot de passe
  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // Connexion réussie, redirigez l'utilisateur ou effectuez d'autres actions.
     
    } catch (error) {
      console.error('Erreur de connexion :', error);
      // Gérez les erreurs d'authentification ici.
    }
    
  }
  
  async signOut() {
    try {
      await this.auth.signOut();
      // Déconnexion réussie, redirigez l'utilisateur ou effectuez d'autres actions.
    } catch (error) {
      console.error('Erreur de déconnexion :', error);
      // Gérez les erreurs de déconnexion ici.
    }
  }
}
