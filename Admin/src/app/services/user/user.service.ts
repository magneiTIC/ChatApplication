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
    return this.http.get(`${this.apiUrl}/admin/divisions`).pipe(
      map((divisions: any) => {
        return divisions
      })
    );
  }}
