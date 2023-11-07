import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://localhost:3000'; // Assurez-vous de mettre à jour l'URL appropriée

  constructor(private http: HttpClient) { }



   createChatWithExternalAgent(emailUserA:string,emailUserB:string) 
    {
    return this.http
      .post<any>(this.apiUrl + `/chat/createExternalDivisionChat`, {"emailUserA": emailUserA,"emailUserB":emailUserB})
      .pipe(
        map((userData: any) => {
          return userData
        })
      )
  }

  blockMessagesInChat(chatId:string){
    return this.http
    .post<any>(this.apiUrl + `/chat/${chatId}/blockMessage,`, {"chatId":chatId})
    .pipe(
      map((userData: any) => {
        return userData
      })
    )
  }

  getChatsByUser(id: string) {
    return this.http
      .get<any>(this.apiUrl + '/chat/' + id)
      .pipe(
        map((userData: any) => {
          return userData
        })
 
      )

  }

  private selectedChatSubject = new BehaviorSubject<{ chatId: string | null, username: string | null, sharedKey: string | null }>({ chatId: null, username: null, sharedKey: null });
  selectedChat$ = this.selectedChatSubject.asObservable();

  selectedChat(chatId: string | null, username: string | null, sharedKey: string | null) {
    this.selectedChatSubject.next({ chatId, username, sharedKey });
  }
  
getActiveChat(): Observable<{ chatId: string | null; username: string | null, sharedKey: string | null }> {
    return this.selectedChat$;
  }


  addMessageToChat(chatId: string, user: string, content: string, type: string) {
    return this.http
      .post<any>(this.apiUrl + `/chat/addMessage/${chatId}`, { "chatId": chatId, "user": user, "content": content, "type": type })
      .pipe(
        map((userData: any) => {
          return userData
        })
      )
  }
  // addMediaToChat(chatId: string, user: string, media:any,type:string) {
  //   return this.http
  //     .post<any>(this.apiUrl + `/chat/addMessage/${chatId}`, { "chatId": chatId, "user": user ,"media":media,"type":type})
  //     .pipe(
  //       map((userData: any) => {
  //         return userData
  //       })
  //     )
  // }
  addMediaToChat(chatId: string, user: string, media: any, type: string) {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('user', user);

    formData.append('type', type);
  
    formData.append('file', media);
  
    return this.http.post<any>(this.apiUrl + `/chat/addMedia/${chatId}`, formData);
  }
  


}
