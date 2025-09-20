// src/app/auth/services/translate-app.service.spec.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class TranslateAppService {

  constructor(private translate: TranslateService) {
    // Define los idiomas disponibles
    this.translate.addLangs(['en', 'es']);
    // Establece el idioma por defecto
    this.translate.setDefaultLang('en');
  }

  /**
   * Inicializa el idioma de la app:
   * 1. Consulta Preferences por un valor guardado.
   * 2. Si no existe, detecta el idioma del dispositivo.
   * 3. Si no es 'en' ni 'es', queda en 'en'.
   */
  async init(): Promise<void> {
    const saved = await Preferences.get({ key: 'lang' });
    let lang = saved.value
      || (await Device.getLanguageCode()).value?.toLowerCase()
      || 'en';

    lang = ['en', 'es'].includes(lang.slice(0, 2))
      ? lang.slice(0, 2)
      : 'en';

    this.translate.use(lang);
    await Preferences.set({ key: 'lang', value: lang });
  }

  /**
   * Alterna entre 'es' y 'en'.
   * Guarda la selección en Preferences.
   */
  async toggle(): Promise<void> {
    const next = this.translate.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(next);
    await Preferences.set({ key: 'lang', value: next });
  }

  /** Devuelve el idioma actualmente activo */
  get currentLang(): string {
    return this.translate.currentLang;
  }
}