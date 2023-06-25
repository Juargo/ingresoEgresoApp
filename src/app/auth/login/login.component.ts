import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService
      .loginUsuario(email, password)
      .then((credendiales) => {
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
