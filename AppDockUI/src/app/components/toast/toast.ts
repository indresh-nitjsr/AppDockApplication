import { ChangeDetectorRef, Component } from '@angular/core';
import type { ToastModel } from '../../core/services/toast-service';
import { ToastService } from '../../core/services/toast-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toasts: ToastModel[] = [];

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
      this.cdr.detectChanges(); // 👈 manually trigger change detection
    });
  }

  trackById(index: number, toast: ToastModel) {
    return toast.id;
  }

  dismiss(toast: ToastModel) {
    this.toastService.dismiss(toast);
  }

  getToastWrapperClass(type: ToastModel['type']) {
    switch (type) {
      case 'success':
        return 'border-l-4 border-green-500';
      case 'error':
        return 'border-l-4 border-red-500';
      case 'info':
        return 'border-l-4 border-blue-500';
      case 'warning':
        return 'border-l-4 border-yellow-500';
      default:
        return '';
    }
  }

  getIconBgClass(type: ToastModel['type']) {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-500 dark:bg-yellow-800 dark:text-yellow-200';
      default:
        return '';
    }
  }
}
