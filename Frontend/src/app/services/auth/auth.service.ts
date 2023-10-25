import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000'

  constructor(private auth: Auth, private http: HttpClient) { }

  createUser(userData: any) {
    return this.http.post(`${this.apiUrl}/admin/create-user`, userData);
  }

  async isProfileConfigured(email: string) {
    return this.http.post(`${this.apiUrl}/users/isProfileConfigured`, email);
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      console.error("L'email et le mot de passe sont requis.");
      return null;
    }
    try {
      const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredentials.user;
      sessionStorage.setItem('uid', user.uid);
      if (user.email) sessionStorage.setItem('email', user.email);
      this.setUserStatus('connecté',user.uid);
      return user;
    } catch (error) {
      console.error('Erreur de connexion :', error);
      return null;
    }
  }

  setUserStatus(status: string, userUID: string) {
    const data = {
      status: status,
      connectionTime: status === 'connecté' ? new Date().toISOString() : null,
      disconnectionTime: status === 'déconnecté' ? new Date().toISOString() : null,
    };
    this.http.post(`${this.apiUrl}/users/${userUID}/setUserStatus`, data).subscribe(
      (response) => {
        console.log("Status :", status);
        console.log('Statut mis à jour avec succès :', response);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut :', error);
      }
    );
  }

  async createUserWithFirebase(username: string, hashedPassword: string, email: string) {
    const userUpdated = {
      'username': username,
      'email': email,
      'password': hashedPassword
    }
    console.log("HashedPassword", userUpdated.password);
    return this.http.post(`${this.apiUrl}/users/register`, userUpdated);
  }

  async getCurrentUserIdByUid(uid: string): Promise<string> {
    // Faites une requête HTTP pour obtenir l'ID de l'utilisateur par son UID
    // Cela suppose que vous avez une API côté serveur qui peut effectuer cette recherche
    const userId = await this.http.get<string>(`${this.apiUrl}/users/${uid}`).toPromise();
    if (userId === undefined) {
      throw new Error("L'utilisateur n'a pas été trouvé.");
    }
    sessionStorage.setItem("id,",userId)
    console.log("session storage de id",userId)
    return userId;
  }
  
    logout() {
    const uid = sessionStorage.getItem('uid');
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    this.setUserStatus('déconnecté', uid!);
  }

  
}
