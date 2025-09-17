import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService } from 'src/app/shared/services/ui.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private ui: UiService) {}

  async onLogin() {
    try {
      await this.authService.login(this.email, this.password);
      this.ui.showSuccess('¡Bienvenido de nuevo!');
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      this.ui.showToast(this.firebaseErrorMessage(err.code));
    }
  }
 private firebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/invalid-email':
        return 'El formato del correo no es válido.';
      default:
        return 'Ocurrió un error inesperado. Intenta de nuevo.';
    }
  }

}

