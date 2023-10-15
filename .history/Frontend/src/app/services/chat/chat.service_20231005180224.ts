// import { Injectable } from '@angular/core';
// import { Firestore, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
// import { UserService } from '../user/user.service';
// import { ProfileUser } from 'src/app/models/user-profile';
// import { Observable, take,concatMap, map } from 'rxjs';
// import { Chat } from 'src/app/models/chat';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {

//   constructor(
//     private firestore:Firestore,
//     private userService:UserService
//   ) { }

//   crateChat(otherUser:ProfileUser):Observable<string>{
//     const ref = collection(this.firestore, 'chats');
//     return this.userService.currentUserProfile$.pipe(
//       take(1),
//       concatMap((user) =>
//         addDoc(ref, {
//           userIds: [user?.uid, otherUser?.uid],
//           users: [
//             {
//               displayName: user?.displayName ?? '',
//               photoURL: user?.photoURL ?? '',
//             },
//             {
//               displayName: otherUser.displayName ?? '',
//               photoURL: otherUser.photoURL ?? '',
//             },
//           ],
//         })
//       ),
//       map((ref) => ref.id)
//     );
//   }

//   // get myChats$(): Observable<Chat[]> {
//   //   const ref = collection(this.firestore, 'chats');
//   //   return this.userService.currentUserProfile$.pipe(
//   //     concatMap((user) => {
//   //       const myQuery = query(
//   //         ref,
//   //         where('userIds', 'array-contains', user?.uid)
//   //       );
//   //       return collectionData(myQuery, { idField: 'id' }).pipe(
//   //         map((chats: any) => this.addChatNameAndPic(user?.uid, chats))
//   //       ) as Observable<Chat[]>;
//   //     })
//   //   );
//   // }

//   addChatNameAndPic(currentUserId: string | undefined, chats: Chat[]): Chat[] {
//     chats.forEach((chat: Chat) => {
//       const otherUserIndex =
//         chat.userIds.indexOf(currentUserId ?? '') === 0 ? 1 : 0;
//       const { displayName, photoURL } = chat.users[otherUserIndex];
//       chat.chatName = displayName;
//       chat.chatPic = photoURL;
//     });

//     return chats;
//   }  
// }

