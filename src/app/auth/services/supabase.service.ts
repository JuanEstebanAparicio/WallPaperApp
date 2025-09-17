import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async uploadWallpaper(file: File, userId: string) {
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await this.supabase.storage
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