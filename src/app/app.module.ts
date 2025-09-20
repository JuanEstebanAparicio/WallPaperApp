// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth }        from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// ↓↓↓ Estas son las únicas líneas nuevas ↓↓↓
import { HttpClientModule, HttpClient }      from '@angular/common/http';
import { TranslateModule, TranslateLoader }  from '@ngx-translate/core';
import { TranslateHttpLoader }               from '@ngx-translate/http-loader';

// Esta función factory usa el constructor de 3 args (http, prefix, suffix)
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// ↑↑↑ Fin de lo nuevo ↑↑↑

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    // 1) Importa HttpClientModule antes de TranslateModule
    HttpClientModule,

    // 2) Configura TranslateModule con la factory
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}