import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/auth/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}