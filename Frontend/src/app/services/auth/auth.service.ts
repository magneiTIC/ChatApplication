import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { User } from '../user/user.interface';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) { }

  // Méthode pour inscrire l'administrateur
  registerAdmin(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // L'administrateur a été inscrit avec succès
        const user = userCredential.user;
        console.log('Compte administrateur créé avec l\'ID :', user.uid);
        // Vous pouvez ajouter des privilèges spéciaux ici, par exemple, stocker un rôle d'administrateur dans Firestore.
      })
      .catch((error) => {
        console.error('Erreur lors de la création du compte administrateur :', error);
      });
  }

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
