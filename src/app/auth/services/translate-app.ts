import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class TranslateAppService {

  constructor(private translate: TranslateService) {
    // Idiomas soportados
    this.translate.addLangs(['en', 'es']);
    // Idioma por defecto
    this.translate.setDefaultLang('en');
  }

  /**
   * Inicializa el idioma de la app
   * 1. Busca idioma guardado en Preferences
   * 2. Si no hay, detecta idioma del dispositivo
   * 3. Si no es es/en, usa inglés
   */
  async init() {
    const saved = await Preferences.get({ key: 'lang' });

    let lang = saved.value || (await Device.getLanguageCode()).value?.toLowerCase() || 'en';
    lang = ['en', 'es'].includes(lang.slice(0, 2)) ? lang.slice(0, 2) : 'en';

    this.translate.use(lang);
    await Preferences.set({ key: 'lang', value: lang });
  }

  /**
   * Cambia entre español e inglés
   */
  async toggle() {
    const next = this.translate.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(next);
    await Preferences.set({ key: 'lang', value: next });
  }

  /**
   * Devuelve el idioma actual
   */
  get currentLang() {
    return this.translate.currentLang;
  }
}