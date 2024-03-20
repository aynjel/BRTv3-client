import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface ToastData {
  message: string;
  show?: boolean;
  type?: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast: ToastData;
  open = new Subject<ToastData>();

  constructor() {
    this.toast = {
      message: '',
      show: false,
      type: ToastType.SUCCESS,
      duration: 3000,
    };
  }

  show(data: ToastData): void {
    if (data.type) {
      this.toast.type = data.type;
    }
    this.toast = { ...data, show: true };
    this.open.next(this.toast);
  }

  hide(): void {
    this.toast.show = false;
    this.open.next(this.toast);
  }
}
