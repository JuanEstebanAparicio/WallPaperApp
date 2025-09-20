import { Component, inject, OnInit } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UiService } from '../../../shared/services/ui.service';
import { SupabaseService } from '../../services/supabase.service';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { TranslateAppService } from 'src/app/auth/services/translate-app.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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
  wallpapers: { name: string; url: string }[] = [];

  constructor(private translateApp: TranslateAppService) {}
  async ngOnInit(): Promise<void> {
  try {
    const { data: { user } } = await this.supabase.client.auth.getUser();
    if (!user) {
      console.warn('No hay sesión en Supabase, intentando restaurar...');
      // Aquí podrías forzar un login silencioso si tienes email/clave guardados
      return;
    }
    this.wallpapers = await this.supabase.listMyWallpapersWithUrls();
  } catch (err) {
    console.error('Error listando wallpapers:', err);
  }

  }
  async toggleLang() {
    await this.translateApp.toggle();
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
  try {
    const file: File = event.target.files[0];
    if (!file) return;

    const filePath = await this.supabase.uploadWallpaper(file);

    await setDoc(doc(collection(this.firestore, 'wallpapers')), {
      ownerUid: this.auth.currentUser?.uid || null,
      supabasePath: filePath,
      createdAt: new Date()
    });

    this.wallpapers = await this.supabase.listMyWallpapersWithUrls();
    this.ui.showSuccess('Wallpaper subido con éxito');
  } catch (err: any) {
    this.ui.showError(err.message || 'Error al subir wallpaper');
  }
}





}