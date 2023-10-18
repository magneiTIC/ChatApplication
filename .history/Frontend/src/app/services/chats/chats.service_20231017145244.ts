import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://localhost:3000'; // Assurez-vous de mettre à jour l'URL appropriée

  constructor(private http: HttpClient) {}


 
  createChat(){
    return this.http
      .post<any>(this.apiUrl+'',{})
      .pipe(
        map((userData: any )=>{
         return userData
        })
       )
  }

  // getChatsByUser(id:string){
  //   return this.http
  //   .get<any>(this.apiUrl+'/chat/'+id)
  //   .pipe(
  //     map((userData: any )=>{
  //      return userData
  //     })

  //    )

  // }

 

   addMessageToChat(chatId:string, user:string, content:string) {
    return this.http
      .post<any>(this.apiUrl+'/addMessage',{})
      .pipe(
        map((userData: any )=>{
         return userData
        })
       )
   }

}
