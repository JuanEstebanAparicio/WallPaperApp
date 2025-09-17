import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { updateProfile } from 'firebase/auth';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);



async register(email: string, password: string, username: string) {
  const cred = await createUserWithEmailAndPassword(this.auth, email, password);

  // Guardar en Firestore
  await setDoc(doc(this.firestore, 'users', cred.user.uid), {
    email,
    username,
    createdAt: new Date()
  });

  // Guardar también en Auth (displayName)
  await updateProfile(cred.user, { displayName: username });

  return cred;
}

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}