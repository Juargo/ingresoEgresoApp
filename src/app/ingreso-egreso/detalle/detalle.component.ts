import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  ingresosEgresos: IngresoEgreso[];
  constructor(
    private store: Store<AppState>,
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
    this.ingresoEgresoService.borrarIngresoEgreso(uidItem);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
