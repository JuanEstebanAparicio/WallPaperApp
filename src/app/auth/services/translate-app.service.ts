import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';

@Injectable({
  providedIn: 'root'
})
export class TranslateAppService {

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
  }

  /** Inicializa el idioma al arrancar la app */
  async init(): Promise<void> {
    // 1. Intentar cargar idioma guardado
    const saved = await Preferences.get({ key: 'lang' });

    let lang = saved.value;

    // 2. Si no hay guardado, detectar idioma del dispositivo
    if (!lang) {
      const deviceLang = (await Device.getLanguageCode()).value?.toLowerCase();
      lang = deviceLang && ['en', 'es'].includes(deviceLang.slice(0, 2))
        ? deviceLang.slice(0, 2)
        : 'en';
    }

    // 3. Usar idioma y guardarlo
    this.translate.use(lang);
    await Preferences.set({ key: 'lang', value: lang });
  }

  /** Alterna entre inglés y español y guarda la preferencia */
  async toggle(): Promise<void> {
    const next = this.translate.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(next);
    await Preferences.set({ key: 'lang', value: next });
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }
}