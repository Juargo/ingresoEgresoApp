import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subcription: Subscription = new Subscription();
  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.subcription.add(
      this.store
        .select('user')
        .pipe(filter((auth) => auth.user !== null))
        .subscribe((user) => {
          this.ingresoEgresoService.initIngresosEgresosListener(user.user.uid);
        })
    );
  }

  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
