import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit-merhant',
  templateUrl: './edit-merhant.component.html',
  styleUrls: ['./edit-merhant.component.scss'],
})
export class EditMerhantComponent {
  private unsubscribe$ = new Subject<void>();

  @Input() existingMerchant: any[] = [];
  @Output() added: EventEmitter<void> = new EventEmitter<void>();
  merchantList = [];

  merchantMessage = '';

  selectedMerchantList = [];

  messageDisplay = false;

  message = '';

  editMerchant() {
    console.log('editMerchant');
  }
}
