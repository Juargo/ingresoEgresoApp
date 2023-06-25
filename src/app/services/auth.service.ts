import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';
import { setDoc, Firestore, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  initAuthListener() {
    authState(this.auth).subscribe((fUser) => {
      console.log(fUser);
      console.log(fUser?.uid);
      console.log(fUser?.email);
    });
  }

  createUser(name: string, email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      ({ user }) => {
        console.log(user);
        // const newUser = new User(user.uid, name, email);
        // return setDoc(doc(this.firestore, user.uid, 'user'), {...newUser});
      }
    );
  }

  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<any> {
    return signOut(this.auth);
  }
}
