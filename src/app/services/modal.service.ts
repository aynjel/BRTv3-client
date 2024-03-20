import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  showModal(modalD: string) {
    if (!modalD) return;

    const modal = document.getElementById(modalD) as any;
    modal.showModal();
  }

  close(modalID: string) {
    if (!modalID) return;

    const modal = document.getElementById(modalID) as any;
    modal.close();
  }
}
