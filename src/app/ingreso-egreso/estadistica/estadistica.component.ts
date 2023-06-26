import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  totalEgresos: number = 0;
  egresos: number = 0;
  totalIngresos: number = 0;
  ingresos: number = 0;

  // Doughnut
  public doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [] }],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.subscription.add(
      this.store.select('ingresosEgresos').subscribe((state) => {
        for (const item of state.items) {
          if (item.tipo === 'ingreso') {
            this.totalIngresos += item.monto;
            this.ingresos++;
          } else {
            this.totalEgresos += item.monto;
            this.egresos++;
          }
        }

        this.doughnutChartData.datasets = [
          { data: [this.totalIngresos, this.totalEgresos] },
        ];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
