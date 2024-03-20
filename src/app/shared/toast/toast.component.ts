import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { ToastData, ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast">
      <div
        class="alert"
        [ngClass]="{
          'alert-success': toastService.toast.type === 'success',
          'alert-error': toastService.toast.type === 'error',
          'alert-warning': toastService.toast.type === 'warning',
          'alert-info': toastService.toast.type === 'info'
        }"
        *ngIf="toastService.toast.show"
      >
        <span>{{ toastService.toast.message }}</span>
      </div>
    </div>
  `,
  styles: [],
})
export class ToastComponent {
  toastService = inject(ToastService);

  constructor() {
    this.toastService.open.subscribe({
      next: (data: ToastData) => {
        if (data.show) {
          setTimeout(() => {
            this.toastService.hide();
          }, data.duration);
        }
        console.log(data);
      },
      error: err => {
        console.error(err);
      },
    });
  }
}
