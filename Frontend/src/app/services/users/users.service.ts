import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  getAllUsersInSameDivision() {
    const uid = sessionStorage.getItem('uid');
    return this.http
    .get<any>(`${this.apiUrl}/users/${uid}/same-division`)
    .pipe(
      map((userData: any )=>{
       return userData
      })

     )
    ;
  }

  getAllUsers(){
    return this.http
    .get<any>(this.apiUrl+'/users/')
    .pipe(
      map((userData: any )=>{
       return userData
      })

     )
  }
}
