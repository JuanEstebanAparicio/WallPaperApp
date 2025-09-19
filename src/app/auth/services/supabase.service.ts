import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
  auth: {
    persistSession: false, // evita navigator.locks
    autoRefreshToken: false
  }
});
  }

async uploadWallpaper(file: File, firebaseUid: string) {
  if (!(file instanceof File)) throw new Error('Archivo inválido');

  const safeName = file.name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');

  const filePath = `${firebaseUid}/${Date.now()}-${safeName}`;

  const { error } = await this.supabase
    .storage
    .from('wallpapers')
    .upload(filePath, file, { upsert: false });

  if (error) throw error;
  return filePath;
}

  async getSignedUrl(filePath: string) {
    const { data, error } = await this.supabase.storage
      .from('wallpapers')
      .createSignedUrl(filePath, 60 * 60); // 1 hora

    if (error) throw error;
    return data.signedUrl;
  }



}