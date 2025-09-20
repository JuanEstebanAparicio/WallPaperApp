import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { updateProfile } from 'firebase/auth';
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private supabase = inject(SupabaseService);

  async register(email: string, password: string, username: string) {
    // 1) Firebase
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    await setDoc(doc(this.firestore, 'users', cred.user.uid), {
      email,
      username,
      createdAt: new Date()
    });
    await updateProfile(cred.user, { displayName: username });

    // 2) Supabase: signUp + signIn para asegurar sesión activa
    const { error: signUpErr } = await this.supabase.client.auth.signUp({ email, password });
    if (signUpErr && !/already/i.test(signUpErr.message)) throw signUpErr;

    const { error: signInErr } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (signInErr) throw signInErr;

    return cred;
  }

  async login(email: string, password: string) {
    // 1) Firebase
    await signInWithEmailAndPassword(this.auth, email, password);

    // 2) Supabase
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async logout() {
    await signOut(this.auth);
    const { error } = await this.supabase.client.auth.signOut();
    if (error) throw error;
  }
}