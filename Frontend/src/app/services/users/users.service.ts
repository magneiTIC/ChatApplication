import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl = 'http://localhost:3000'
  constructor(private http: HttpClient) { }
  getAllUsersInSameDivision() {
    const uid = sessionStorage.getItem('uid');
    return this.http.post(`${this.apiUrl}/users/:uid/same-division`, uid);
  }
}
