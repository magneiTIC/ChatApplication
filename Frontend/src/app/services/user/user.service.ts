import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import {Firestore, collection, collectionData, doc, docData, getFirestore, query} from '@angular/fire/firestore';
import { ProfileUser } from 'src/app/models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user:ProfileUser) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }


  get allUsers$(): Observable<ProfileUser[]> {
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<ProfileUser[]>;
  }
 
}
