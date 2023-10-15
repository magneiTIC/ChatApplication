import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://localhost:3000/api/users'; // Assurez-vous de mettre à jour l'URL appropriée

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Prof[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
