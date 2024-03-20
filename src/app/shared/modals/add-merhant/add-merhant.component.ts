import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-merhant',
  templateUrl: './add-merhant.component.html',
  styleUrls: ['./add-merhant.component.scss'],
})
export class AddMerhantComponent {
  private unsubscribe$ = new Subject<void>();

  @Input() existingMerchant: any[] = [];
  @Output() added: EventEmitter<void> = new EventEmitter<void>();
  merchantList = [];

  merchantMessage = '';

  selectedMerchantList = [];

  messageDisplay = false;

  message = '';

  addMerchant() {
    console.log('addMerchant');
  }
}
