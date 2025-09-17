import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { UiService } from 'src/app/shared/services/ui.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
email: string = '';
password: string = '';
confirmPassword: string = '';
username: string = '';

  constructor(private authService: AuthService, private router: Router, private ui: UiService) { }

  ngOnInit() {
  }

async onRegister() {
  if (this.password !== this.confirmPassword) {
    this.ui.showError('Las contraseñas no coinciden');
    return;
  }

  try {
    await this.authService.register(this.email, this.password, this.username);
    this.ui.showSuccess('¡Cuenta creada con éxito!');
    this.router.navigateByUrl('/home', { replaceUrl: true });
  } catch (err: any) {
    this.ui.showError(this.firebaseErrorMessage(err.code));
  }
}
private firebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.';
      case 'auth/invalid-email':
        return 'El formato del correo no es válido.';
      default:
        return 'Ocurrió un error inesperado. Intenta de nuevo.';
    }
  }


}



