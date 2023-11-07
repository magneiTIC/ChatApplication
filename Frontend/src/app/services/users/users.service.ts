import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnInit {

  // directeurs: any[] | undefined;
  // agents: any[] | undefined;

  apiUrl = 'http://localhost:3000'

  numberOfDirectors: any;
  numberOfAgents: any;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

 

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

  getAllDivisions() {
    return this.http
    .get<any>(this.apiUrl + '/admin/divisions')
    .pipe(
      map((userData: any) => {
        return userData
      })
    )
  }

  getAllUsersInSameDivision() {
    const uid = sessionStorage.getItem('uid');
    return this.http
      .get<any>(`${this.apiUrl}/users/${uid}/same-division`)
      .pipe(
        map((userData: any) => {
          return userData
        })
      );
  }

  getAllUsers() {
    return this.http
      .get<any>(this.apiUrl + '/users/')
      .pipe(
        map((userData: any) => {
          return userData
        })
      )
  }

 listContactsInSameDivision(uid:string){
  return this.http
      .get<any>(this.apiUrl + `/users/contacts/${uid}`)
      .pipe(
        map((userData: any) => {
          return userData
        })

      )

 }
contactsByDivision(uid:string){

  return this.http
  .get<any>(this.apiUrl + `/users/contactsByDivision/${uid}`)
  .pipe(
    map((userData: any) => {
      return userData
    })

  )

}

  countDirectors() {
    this.http.get<{ numberOfDirectors: number }>(`${this.apiUrl}/admin/count-directors`)
      .subscribe(response => {
        this.numberOfDirectors = response.numberOfDirectors;
      });
  }
 
  countAgents() {
    this.http.get<{ numberOfAgents: number }>(`${this.apiUrl}/admin/count-agents`)
      .subscribe(response => {
       const numberOfAgents = response.numberOfAgents;
      });
  }


}