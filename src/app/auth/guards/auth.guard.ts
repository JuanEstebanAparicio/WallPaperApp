import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { SupabaseService } from '../services/supabase.service'; // ajusta ruta
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);
  private supabase = inject(SupabaseService);

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Verificar si Supabase ya tiene sesión
            const { data: { user: sbUser } } = await this.supabase.client.auth.getUser();

            if (!sbUser) {
              // Si no hay sesión en Supabase, iniciar con email/clave
              // ⚠️ Necesitas tener la clave en memoria o un flujo para obtenerla
              // En dev, puedes guardar la clave en localStorage al login/registro
              const email = firebaseUser.email!;
              const password = localStorage.getItem('lastPassword'); // ejemplo
              if (password) {
                const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
                if (error) throw error;
              }
            }

            observer.next(true);
          } catch (err) {
            console.error('Error iniciando sesión en Supabase desde guard:', err);
            this.router.navigate(['/auth/login']);
            observer.next(false);
          }
        } else {
          this.router.navigate(['/auth/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}