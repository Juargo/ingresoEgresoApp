import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as uiActions from 'src/app/shared/ui.actions';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  registroForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.subscription.add(
      this.store.select('ui').subscribe((ui) => (this.loading = ui.isLoading))
    );
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) {
      return;
    }

    this.store.dispatch(uiActions.isLoading());

    const { nombre, email, password } = this.registroForm.value;

    this.authService
      .createUser(nombre, email, password)
      .then((credenciales) => {
        this.store.dispatch(uiActions.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: err.message,
        });
        this.store.dispatch(uiActions.stopLoading());
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
