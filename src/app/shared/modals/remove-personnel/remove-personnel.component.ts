import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { Personnel } from 'src/app/models/personnel.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-remove-personnel',
  templateUrl: './remove-personnel.component.html',
  styleUrls: ['./remove-personnel.component.scss']
})
export class RemovePersonnelComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() personnelType: string = 'Personnel';
  @Input() personnelData?: Personnel;
  @Output() removed: EventEmitter<void> = new EventEmitter<void>();

  message: string = '';
  messageDisplay: boolean = false;
  isSending: boolean = false;

  constructor (private httpService: HttpService, private modalService: ModalService) { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  remove() {
    if (this.isSending) return;
    if (!this.personnelData) return;

    this.messageDisplay = true;

    this.isSending = true;
    this.message = `Removing ${this.personnelType}...`;

    const params = {
      ...this.personnelData,
      category: this.personnelType.toUpperCase()
    };

    this.httpService.delete('setup/remove', params)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.message = response.message;

          setTimeout(() => {
            this.isSending = false;
            this.message = '';
            this.removed.emit();
            this.modalService.close('removePersonnel');
          }, 1000);
        }, error: (error) => {
          console.error(error);
          this.isSending = false;
          this.message = error.error?.message || error.message || `Error removing ${this.personnelType}`;

        }, complete: () => {

        }
      });
  }
}
