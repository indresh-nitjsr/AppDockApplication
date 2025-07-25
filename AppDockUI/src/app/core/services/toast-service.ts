import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastModel {
  id: string; // 👈 new
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastModel[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private toasts: ToastModel[] = [];

  show(message: string, type: ToastModel['type'] = 'info', duration = 3000) {
    const toast: ToastModel = {
      id: crypto.randomUUID(), // or use Date.now().toString()
      message,
      type,
      duration,
    };

    this.toasts.push(toast);
    this.toastsSubject.next(this.toasts);

    setTimeout(() => this.removeToast(toast.id), duration);
  }

  // 👇 Expose public method to dismiss manually
  dismiss(toast: ToastModel) {
    this.removeToast(toast.id);
  }

  private removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.toastsSubject.next(this.toasts);
  }
}
