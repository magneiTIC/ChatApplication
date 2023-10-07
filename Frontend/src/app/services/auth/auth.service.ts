import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import * as CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000'

  constructor(private auth: Auth, private http: HttpClient) { }

  createUser(userData: any) {
    return this.http.post(`${this.apiUrl}/admin/create-user`, userData);
  }

  isProfileConfigured(email: string) {
    return this.http.post(`${this.apiUrl}/users/isProfileConfigured`, email);
  }

  async login(email: string, password: string) {
    const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
    const user = userCredentials.user;
    // Stockez cette information dans la session du navigateur
    sessionStorage.setItem('uid', user.uid);
    // Vérifiez si l'email n'est pas null avant de le stocker
    if (user.email !== null) {
      sessionStorage.setItem('email', user.email);
    }
    return userCredentials.user;
  }

  async createUserWithFirebase(username: string, password: string, email: string) {
    const userCredentials = await createUserWithEmailAndPassword(this.auth, email, password);
    const userUpdated = {
      'uid': userCredentials.user.uid,
      'username': username,
      'email': userCredentials.user.email
    }
    return this.http.post(`${this.apiUrl}/users/register`, userUpdated);
  }

}
