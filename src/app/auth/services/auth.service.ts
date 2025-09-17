import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  async register(email: string, password: string) {
    const cred = await this.afAuth.createUserWithEmailAndPassword(email, password);
    if (cred.user) {
      await this.afs.collection('users').doc(cred.user.uid).set({
        email,
        createdAt: new Date()
      });
    }
    return cred;
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  getAuthState() {
    return this.afAuth.authState;
  }
}