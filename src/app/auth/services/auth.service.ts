import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async register(email: string, password: string) {
    // 1. Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    // 2. Guardar datos en Firestore (documento con UID como ID)
    await setDoc(doc(this.firestore, 'users', cred.user.uid), {
      email,
      createdAt: new Date()
    });

    return cred;
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}