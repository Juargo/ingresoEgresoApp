import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  Unsubscribe,
} from '@angular/fire/auth';
import { setDoc, Firestore, doc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userUnsubscribe!: Unsubscribe;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    authState(this.auth).subscribe((fUser) => {
      if (fUser) {
        this.userUnsubscribe = onSnapshot(
          doc(this.firestore, fUser.uid, 'usuario'),
          (docUser: any) => {
            let data: any = docUser.data();
            let user = Usuario.fromFirebase(data);
            this.store.dispatch(authActions.setUser({ user }));
          }
        );
      } else {
        this.userUnsubscribe ? this.userUnsubscribe() : null;
        this.store.dispatch(authActions.unSetUser());
      }
    });
  }

  createUser(nombre: string, email: string, password: string): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      ({ user }) => {
        console.log(user);
        const newUser = new Usuario(user.uid, nombre, email);
        return setDoc(doc(this.firestore, user.uid, 'usuario'), { ...newUser });
      }
    );
  }

  loginUsuario(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<any> {
    return signOut(this.auth);
  }

  isAuth(): Observable<boolean> {
    return authState(this.auth).pipe(map((fUser) => fUser !== null));
  }
}
