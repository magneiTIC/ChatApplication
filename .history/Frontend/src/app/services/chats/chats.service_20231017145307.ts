import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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
  getChatsByUser(userId: string): Observable<ChatWithLastMessage[]> {
    // Récupérer les chats de l'utilisateur
    return this.http.get<Chat[]>(`your_api_url/${userId}`).pipe(
      switchMap((chats: Chat[]) => {
        // Créer un tableau d'observables pour récupérer les derniers messages de chaque chat
        const observables: Observable<Message>[] = chats.map((chat) =>
          this.getLastMessage(chat._id)
        );

        // Utiliser forkJoin pour combiner les observables en un seul
        return forkJoin(observables).pipe(
          map((messages: Message[]) => {
            // Associer chaque chat avec son dernier message
            return chats.map((chat, index) => ({
              ...chat,
              lastMessage: messages[index],
            }));
          })
        );
      })
    );
  }

 

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
