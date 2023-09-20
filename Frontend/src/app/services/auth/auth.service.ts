import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { User } from '../user/user.interface';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  // Méthode de connexion par e-mail/mot de passe
  // async signIn(email: string, password: string): Promise<User | null>{
  //   try {
  //    const userCredential=  await signInWithEmailAndPassword(this.auth, email, password);
  //    const user = userCredential.user;
  //     return user
  //     // Connexion réussie, redirigez l'utilisateur ou effectuez d'autres actions.
     
  //   } catch (error) {
  //     console.error('Erreur de connexion :', error); 
  //     // Gérez les erreurs d'authentification ici.
  //   }
    
  // }
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)

      const user = userCredential.user;
      
      return user; 
    } catch (error) {
      console.error('Erreur de connexion :', error);
      
      return null; 
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
