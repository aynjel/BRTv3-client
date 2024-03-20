import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { getMerchant } from 'src/app/config/getMerchantData';
import { numberPattern } from 'src/app/constants/constants';
import { Personnel } from 'src/app/models/personnel.model';
import { HttpService } from 'src/app/services/http.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit-personnel',
  templateUrl: './edit-personnel.component.html',
  styleUrls: ['./edit-personnel.component.scss'],
})
export class EditPersonnelComponent implements OnChanges, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  @Input() personnelType: string = 'Personnel';
  @Input() personnelData?: Personnel;
  @Output() updated: EventEmitter<void> = new EventEmitter<void>();

  editPersonnelForm: FormGroup;

  message: string = '';
  messageDisplay: boolean = false;
  isSending: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private modalService: ModalService
  ) {
    this.editPersonnelForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      contact: ['', Validators.pattern(numberPattern)],
      status: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['personnelData']) return;
    if (changes['personnelData'].firstChange) return;

    const personnelData = changes['personnelData'].currentValue as Personnel;

    const defaultValues = {
      firstName: personnelData.firstName || '',
      lastName: personnelData.lastName || '',
      middleName: personnelData.middleName || '',
      email: personnelData.email || '',
      contact: personnelData.contact || '',
      status: personnelData.status || '',
    };

    this.editPersonnelForm.setValue(defaultValues);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get errorControl() {
    return this.editPersonnelForm.controls;
  }

  updatePersonnel() {
    if (this.isSending) return;

    this.messageDisplay = true;

    if (!this.editPersonnelForm.valid) {
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
    this.message = `Updating ${this.personnelType}...`;

    const payload = {
      ...this.editPersonnelForm.value,
      ID: this.personnelData?.ID,
      category: this.personnelType.toUpperCase(),
    };

    this.httpService
      .update('setup/update', payload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: response => {
          this.message = response.message;

          setTimeout(() => {
            this.isSending = false;
            this.message = '';
            this.updated.emit();
            this.modalService.close('editPersonnel');
            this.resetForm();
          }, 1000);
        },
        error: error => {
          console.error(error);
          this.isSending = false;
          this.message = error.error?.message || error.message || `Error updating ${this.personnelType}`;
        },
        complete: () => { },
      });
  }

  resetForm() {
    this.messageDisplay = false;
    this.message = '';
    // this.editPersonnelForm.reset();
  }
}
