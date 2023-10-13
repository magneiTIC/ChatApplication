import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

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
        console.error('L\'email et le mot de passe sont requis.');
        return null;
    }
    try {
        const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredentials.user;
        sessionStorage.setItem('uid', user.uid);
        console.log("UID USER Sesion: ", sessionStorage.getItem('uid'));
        return user;
    } catch (error) {
        console.error('Erreur de connexion :', error);
        return null;
    }
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



}
