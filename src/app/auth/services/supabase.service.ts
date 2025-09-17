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

async uploadWallpaper(file: File) {
  if (!(file instanceof File)) throw new Error('Archivo inválido');
  const { data: { user } } = await this.supabase.auth.getUser();
  if (!user) throw new Error('No hay sesión en Supabase');

  const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = `${user.id}/${Date.now()}-${safeName}`;

  const { error } = await this.supabase.storage.from('wallpapers').upload(filePath, file, { upsert: false });
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



async signUpWithSupabase(email: string, password: string) {
  const { error } = await this.supabase.auth.signUp({ email, password });
  return { error };
}

async signInWithSupabase(email: string, password: string) {
  const { error } = await this.supabase.auth.signInWithPassword({ email, password });
  return { error };
}

async getSupabaseUserIdOrThrow() {
  const { data: { user }, error } = await this.supabase.auth.getUser();
  if (error || !user) throw new Error('No hay sesión en Supabase');
  return user.id;
}

}