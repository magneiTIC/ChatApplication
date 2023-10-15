import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  private apiUrl = 'http://localhost:3000/api/users'; // Assurez-vous de mettre à jour l'URL appropriée

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<ProfileUser[]> {
    return this.http.get<ProfileUser[]>(this.apiUrl);
  }
  rateChat(otherUser:ProfileUser):Observable<string>{
        const ref = collection(this.firestore, 'chats');
        return this.userService.currentUserProfile$.pipe(
          take(1),
          concatMap((user) =>
            addDoc(ref, {
              userIds: [user?.uid, otherUser?.uid],
              users: [
                {
                  displayName: user?.displayName ?? '',
                  photoURL: user?.photoURL ?? '',
                },
                {
                  displayName: otherUser.displayName ?? '',
                  photoURL: otherUser.photoURL ?? '',
                },
              ],
            })
          ),
          map((ref) => ref.id)
        );
      }
}
