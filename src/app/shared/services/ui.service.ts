// src/app/shared/services/ui.service.ts
import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UiService {
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async showToast(message: string, color: string = 'danger', duration = 3000) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration,
      position: 'top',
      buttons: [{ text: 'Cerrar', role: 'cancel' }]
    });
    await toast.present();
  }

  async showSuccess(message: string, duration = 2500) {
    return this.showToast(message, 'success', duration);
  }

  async showWarning(message: string, duration = 3000) {
    return this.showToast(message, 'warning', duration);
  }

  async showAlert(header: string, message: string, buttons: any[] = ['OK']) {
    const alert = await this.alertCtrl.create({ header, message, buttons });
    await alert.present();
  }
}