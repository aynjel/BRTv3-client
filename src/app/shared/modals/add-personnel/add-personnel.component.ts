import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { numberPattern } from 'src/app/constants/constants';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-personnel.component.html',
  styleUrls: ['./add-personnel.component.scss']
})
export class AddPersonnelComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  @Input() personnelType: string = 'Personnel';
  @Output() added: EventEmitter<void> = new EventEmitter<void>();

  addPersonnelForm: FormGroup;

  message: string = '';
  messageDisplay: boolean = false;
  isSending: boolean = false;

  constructor (private formBuilder: FormBuilder, private httpService: HttpService, private modalService: ModalService) {
    this.addPersonnelForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      contact: ['', Validators.pattern(numberPattern)],
    });
  }

  get errorControl() {
    return this.addPersonnelForm.controls;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  addPersonnel() {
    if (this.isSending) return;

    this.messageDisplay = true;

    if (!this.addPersonnelForm.valid) {
      this.message = 'Please fill the necessary details.';

      setTimeout(() => {
        if (this.messageDisplay) {
          this.message = '';
          this.messageDisplay = false;
        }
      }, 2500);

      return;
    }

    this.isSending = true;
    this.message = `Adding ${this.personnelType}...`;

    const payload = {
      ...this.addPersonnelForm.value,
      category: this.personnelType.toUpperCase()
    };

    this.httpService.post('setup/add', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.message = response.message;

          setTimeout(() => {
            this.isSending = false;
            this.message = '';
            this.added.emit();
            this.modalService.close('addPersonnel');
            this.resetForm();
          }, 1000);
        }, error: (error) => {
          console.error(error);
          this.isSending = false;
          this.message =  error.error?.message || error.message || `Error Adding ${this.personnelType}`;
        }, complete: () => {

        }
      });
  }

  resetForm() {
    this.messageDisplay = false;
    this.message = '';
    this.addPersonnelForm.reset();
  }
}
