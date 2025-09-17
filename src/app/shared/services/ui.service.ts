// src/app/shared/services/ui.service.ts
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class UiService {
  constructor(private toastCtrl: ToastController) {}

async showToast(message: string, color: string = 'danger', icon: string = 'close-circle-outline') {
  const toast = await this.toastCtrl.create({
    message,
    duration: 3000,
    position: 'top',
    color,
    cssClass: `animated-toast icon-${icon}`,
    buttons: [{ text: 'Cerrar', role: 'cancel' }],
    mode: 'ios'
  });
  await toast.present();
}


  async showSuccess(message: string) {
    return this.showToast(message, 'success', 'checkmark-circle-outline');
  }

  async showWarning(message: string) {
    return this.showToast(message, 'warning', 'warning-outline');
  }

  async showError(message: string) {
    return this.showToast(message, 'danger', 'close-circle-outline');
  }
}