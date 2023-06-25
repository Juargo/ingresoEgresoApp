import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit {
  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  crearUsuario(): void {
    if (this.registroForm.invalid) {
      return;
    }

    const { nombre, email, password } = this.registroForm.value;

    this.authService
      .createUser(nombre, email, password)
      .then((credenciales) => {
        Swal.fire({
          title: 'Espere por favor',
          didOpen: () => {
            Swal.showLoading();
          },
        });
      })
      .catch((err) => {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: err.message,
        });
      });
  }
}
