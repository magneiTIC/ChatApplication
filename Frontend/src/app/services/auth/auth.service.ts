import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SocketService } from '../sockets/sockets.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = 'http://localhost:3000'

  constructor(private auth: Auth, private http: HttpClient, private socketService: SocketService) { }



  createUser(email:string,profile:string,division:string) {
    console.log('arrivé',email,profile,division);
   
      return this.http
      .post<any>(this.apiUrl+'/admin/create-user',{
        'email':email,
        'profile':profile,
        'division':division
      }
      )
      .pipe(
        map((userData: any )=>{
        return userData
        })
      )

      
  }

  // async createUser(email:string,profile:string,division:string) {
  //   console.log('arrivé',email,profile,division);
    
  //   try{
  //     return this.http
  //     .post<any>(this.apiUrl+'/admin/create-user',{
  //       'email':email,
  //       'profile':profile,
  //       'division':division
  //     })
  //     .pipe(
  //       map((userData: any )=>{
  //       return userData
  //       })
  //     )

  //     }
  //     catch(error){
  //     console.error("Error creating user", error);
  //   }
  // }

  async isProfileConfigured(email: string) {
    try {
      const response = await this.http.post<{ isProfileConfigured: boolean, profil: any, division: any } | undefined>(`${this.apiUrl}/users/isProfileConfigured`, { email }).toPromise();
      if (response) {
        sessionStorage.setItem('profil', response.profil);
        sessionStorage.setItem('division', response.division);
        return response.isProfileConfigured;
      } else {
        throw new Error('Réponse non définie.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du profil :', error);
      throw new Error('Erreur lors de la vérification du profil');
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      console.error("L'email et le mot de passe sont requis.");
      return null;
    }
    try {
      const userCredentials = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredentials.user;
      const idToken = await user.getIdToken();
      console.log("AUTHTOKEN", idToken);
      sessionStorage.setItem('uid', user.uid);
      sessionStorage.setItem('authToken', idToken);
      if (user.email) sessionStorage.setItem('email', user.email);
      this.setUserStatus('connecté', user.uid);
      return user;
    } catch (error) {
      console.error('Erreur de connexion :', error);
      return null;
    }
  }

  async createUserWithFirebase(username: string, password: string, email: string ) {
    const userUpdated = {
      'username': username,
      'email': email,
      'password': password
    }
    console.log("HashedPassword", userUpdated.password);
    this.http.post(`${this.apiUrl}/users/register`, userUpdated)
      .subscribe(
        (response) => {
          console.log("Utilisateur créé avec succès :", response);
        },
        (error) => {
          console.error("Échec de la requête HTTP :", error);
        }
      );
  }

  async getCurrentUserIdByUid(uid: string): Promise<string> {
    // Faites une requête HTTP pour obtenir l'ID de l'utilisateur par son UID

    try {
      const response = await this.http.get<any>(`${this.apiUrl}/users/${uid}`).toPromise();
      const userId = response.id;

      if (!userId) {
        throw new Error("L'utilisateur n'a pas été trouvé.");
      }
      sessionStorage.setItem("id", userId);
      console.log("session storage de id", sessionStorage.getItem("id"));

      return userId;
    } catch (error) {
      // Gérez les erreurs ici
      console.error("Une erreur s'est produite lors de la récupération de l'ID de l'utilisateur :", error);
      throw error;
    }
  }

  logout() {
    const uid = sessionStorage.getItem('uid');
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('division');
    sessionStorage.removeItem('profil');
    sessionStorage.removeItem('id')
    this.socketService.disconnect();
    this.setUserStatus('déconnecté', uid!);
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

  async hasProfile(profile: string) {
    const userId = sessionStorage.getItem('uid');
    return this.http.get(`${this.apiUrl}/users/${userId}/checkUserProfile`).toPromise()
      .then((response: any) => {
        if (response && response.profile === profile) {
          sessionStorage.setItem('profile', profile);
          return true;
        } else {
          return false;
        }
      })
      .catch((error: any) => {
        console.error('Erreur lors de la vérification du profil :', error);
        return false;
      });
  }

  isUserLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

}
