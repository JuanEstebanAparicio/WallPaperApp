import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
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

  constructor(private authService: AuthService, private router: Router, private ui: UiService, private supabaseService: SupabaseService) { }

  ngOnInit() {
  }

async onRegister() {
  try {
    await this.authService.register(this.email, this.password, this.username);

    // 1) Crear el usuario en Supabase
    const { error: signUpErr } = await this.supabaseService.signUpWithSupabase(this.email, this.password);
    if (signUpErr) throw signUpErr;

    // 2) Garantizar sesión (por si no quedó con session)
    const { error: signInErr } = await this.supabaseService.signInWithSupabase(this.email, this.password);
    if (signInErr) throw signInErr;

    // 3) Verificación explícita
    const user = await this.supabaseService.getSupabaseUserIdOrThrow();

    this.ui.showSuccess('¡Cuenta creada y sesión iniciada!');
    this.router.navigateByUrl('/home', { replaceUrl: true });
  } catch (err: any) {
    this.ui.showError(err.message || 'Error en registro');
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



