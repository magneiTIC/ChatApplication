import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:3000/api/users'; // Assurez-vous de mettre à jour l'URL appropriée

  constructor(private http: HttpClient) {}

  createMessage(user:string, content:string, chatId:string){
    return this.http
        .post<any>(this.apiUrl+'',{
          'user':user,
          'content':content,
          'chatId':chatId
        })
        .pipe(
          map((userData: any )=>{
          return userData
          })
        )
    }



    getMessagesByChat(){
      return this.http.get<ProfileUser[]>(this.apiUrl);
    }
}
