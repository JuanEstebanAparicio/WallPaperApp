import { Component, inject, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UiService } from '../../../shared/services/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private ui = inject(UiService);
  
  displayName: string | null = null;
  email: string | null = null;

  constructor() {}
  ngOnInit(): void {
        onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.displayName = user.displayName;
        this.email = user.email;
      }
    });

  }

    async logout() {
    await signOut(this.auth);
    this.ui.showSuccess('Sesión cerrada');
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}

