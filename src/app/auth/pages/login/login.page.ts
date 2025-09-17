import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { SupabaseService } from '../../services/supabase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private ui: UiService, private supabaseService: SupabaseService) {}

async onLogin() {
  try {
    await this.authService.login(this.email, this.password);

    const { error: supaErr } = await this.supabaseService.signInWithSupabase(this.email, this.password);
    if (supaErr) throw supaErr;

    const uid = await this.supabaseService.getSupabaseUserIdOrThrow();
    this.ui.showSuccess('¡Bienvenido!');
    this.router.navigateByUrl('/home', { replaceUrl: true });
  } catch (err: any) {
    this.ui.showError(err.message || 'Error al iniciar sesión');
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

