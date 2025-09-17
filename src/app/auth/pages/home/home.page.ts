import { Component, inject, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UiService } from '../../../shared/services/ui.service';
import { SupabaseService } from '../../services/supabase.service';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
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
  private supabase = inject(SupabaseService);
  private firestore = inject(Firestore);
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

    async selectFile() {
    const input = document.querySelector<HTMLInputElement>('input[type=file]');
    input?.click();
  }

    async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    try {
      const user = this.auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      const filePath = await this.supabase.uploadWallpaper(file, user.uid);

      await setDoc(doc(this.firestore, 'wallpapers', filePath), {
        owner: user.uid,
        filePath,
        createdAt: new Date()
      });

      this.ui.showSuccess('Wallpaper subido con éxito');
    } catch (err: any) {
      this.ui.showError(err.message || 'Error al subir wallpaper');
    }
  }



}