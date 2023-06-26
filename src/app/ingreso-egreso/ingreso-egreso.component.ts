import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as uiActions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  ingresoEgresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.ingresoEgresoForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      monto: ['', [Validators.required]],
    });

    this.subscription.add(
      this.store.select('ui').subscribe((ui) => {
        this.cargando = ui.isLoading;
      })
    );
  }

  agregar(): void {
    if (this.ingresoEgresoForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    const { descripcion, monto } = this.ingresoEgresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((response) => {
        this.ingresoEgresoForm.reset();
        Swal.fire({
          title: 'Registro creado',
          icon: 'success',
          text: descripcion,
        });
        this.store.dispatch(uiActions.stopLoading());
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
