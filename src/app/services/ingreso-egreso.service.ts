import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import {
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso): Promise<any> {
    const ref = doc(
      this.firestore,
      this.authService.user.uid,
      'ingreso-egreso'
    );
    return updateDoc(ref, {
      items: arrayUnion({ ...ingresoEgreso }),
    });
  }
}
