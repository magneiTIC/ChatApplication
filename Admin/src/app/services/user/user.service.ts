import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  directeurs: any[] | undefined;
  agents: any[] | undefined;

  apiUrl = 'http://localhost:3000'
  
  async createUser(email:string,profile:string,division:string) {
    try{
      this.http.post(`${this.apiUrl}/admin/create-user`, {email,profile,division});
      
      
      return console.log('creation reussie');
    }catch(error){
      console.error("Error creating user", error);
    }
  }
  getUser() {

    return this.http
    .get<any>(this.apiUrl + '/admin/user')
    .pipe(
      map((userData: any) => {
        return userData
      })
    )
  }

  getAllDirectors() {
    return this.http
    .get<any>(this.apiUrl + '/admin/directeurs')
    .pipe(
      map((userData: any) => {
        return userData
      })
    )
  }

  getAllAgents() {
    return this.http
    .get<any>(this.apiUrl + '/admin/agents')
    .pipe(
      map((userData: any) => {
        return userData
      })
    )
  }
  countDirectors()  {
   return this.http
    .get<any>(this.apiUrl + '/admin/count-directors')
    .pipe(
      map((userData: any) => {
        return userData
      })
    )
  }
 
  countAgents() {
    return this.http
    .get<any>(this.apiUrl + '/admin/count-agents')
    .pipe(
      map((userData: any) => userData)
    );
  }
  getAllDivisions() {
    return this.http.get(`${this.apiUrl}/admin/divisions`).pipe(
      map((divisions: any) => {
        return divisions
      })
    );
  }}
