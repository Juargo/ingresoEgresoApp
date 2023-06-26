import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso.action';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  ingresosEgresos: IngresoEgreso[];
  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('ingresosEgresos').subscribe(({ items }) => {
        this.ingresosEgresos = items;
      })
    );
  }

  borrar(uidItem: string) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(uidItem)
      .then(() => {
        Swal.fire({
          title: 'Registro borrado',
          icon: 'success',
          text: uidItem,
        });
        this.store.dispatch(ingresoEgresoActions.deleteItem({ uidItem }));
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: err.message,
        });
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
