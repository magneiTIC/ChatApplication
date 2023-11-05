import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // async login(email: string, password: string) {
  //   if (!email || !password) {
  //     console.error("L'email et le mot de passe sont requis.");
  //     return null;
  //   }
  //   try {
  //     const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
  //     const user = userCredentials.user;
  //     const idToken = await user.getIdToken();
  //     console.log("AUTHTOKEN", idToken);
  //     sessionStorage.setItem('uid', user.uid);
  //     sessionStorage.setItem('authToken', idToken); 
  //     if (user.email) sessionStorage.setItem('email', user.email);
  //     this.setUserStatus('connecté',user.uid);
  //     return user;
  //   } catch (error) {
  //     console.error('Erreur de connexion :', error);
  //     return null;
  //   }
  // }
}
