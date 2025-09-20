import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {

    this.supabase = createClient(
      environment.supabase.supabaseUrl,
      environment.supabase.supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
  }


      setAuthToken(token: string) {
       this.supabase = createClient(
       environment.supabase.supabaseUrl,
       environment.supabase.supabaseKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
  }


async uploadWallpaper(file: File, firebaseUid: string) {
  const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = `${firebaseUid}/${Date.now()}-${safeName}`;

  const { error } = await this.supabase
    .storage
    .from('wallpapers')
    .upload(filePath, file, { upsert: false });

  if (error) throw error;
  return filePath;
}
async listMyWallpapers() {
  const userId = await this.getSupabaseUserIdOrThrow();

  const { data, error } = await this.supabase
    .storage
    .from('wallpapers')
    .list(userId, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' }
    });

  if (error) throw error;
  return data; // array con { name, id, updated_at, ... }
}
async listMyWallpapersWithUrls() {
  const userId = await this.getSupabaseUserIdOrThrow();
  const { data, error } = await this.supabase
    .storage
    .from('wallpapers')
    .list(userId, { sortBy: { column: 'created_at', order: 'desc' } });
  if (error) throw error;

  const urls = await Promise.all(
    data.map(async (file) => {
      const filePath = `${userId}/${file.name}`;
      const signedUrl = await this.getSignedUrl(filePath);
      return { name: file.name, url: signedUrl };
    })
  );
  return urls;
}



  async getSignedUrl(filePath: string) {
    const { data, error } = await this.supabase
      .storage
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