import { Injectable } from '@angular/core';
import { Firestore, addDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { Unsubscribe } from 'firebase/auth';
import { Auth, authState } from '@angular/fire/auth';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  userUnsubscribe!: Unsubscribe;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private store: Store<AppState>,
    private auth: Auth
  ) {}

  initIngresosEgresosListener(uid: string) {
    return onSnapshot(
      collection(this.firestore, uid, 'ingreso-egreso/items'),
      (doc) => {
        let changes = doc.docChanges();
        let items: IngresoEgreso[] = [];
        changes.map((data) => {
          if (data.type !== 'removed') {
            let docData = data.doc.data() as IngresoEgreso;
            items.push({ uid: data.doc.id, ...docData });
          }
        });

        this.store.dispatch(ingresoEgresoActions.setItems({ items }));
      }
    );
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso): Promise<any> {
    delete ingresoEgreso.uid;
    return addDoc(
      collection(
        this.firestore,
        `${this.authService.user.uid}`,
        'ingreso-egreso',
        'items'
      ),
      { ...ingresoEgreso }
    );
  }

  borrarIngresoEgreso(uidItem: string) {
    return deleteDoc(
      doc(
        this.firestore,
        this.authService.user.uid,
        'ingreso-egreso',
        'items',
        uidItem
      )
    );
  }
}
