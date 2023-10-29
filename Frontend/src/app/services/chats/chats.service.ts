import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://localhost:3000'; // Assurez-vous de mettre à jour l'URL appropriée

  constructor(private http: HttpClient) { }



  createChat() {
    return this.http
      .post<any>(this.apiUrl + '', {})
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

  private selectedChatSubject = new BehaviorSubject<{ chatId: string | null, username: string | null }>({ chatId: null, username: null });
  selectedChat$ = this.selectedChatSubject.asObservable();

  selectedChat(chatId: string | null, username: string | null) {
    this.selectedChatSubject.next({ chatId, username });
  }
  
getActiveChat(): Observable<{ chatId: string | null; username: string | null }> {
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


}
