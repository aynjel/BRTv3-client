import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-remarks-analytics',
  templateUrl: './remarks-analytics.component.html',
  styleUrls: ['./remarks-analytics.component.scss'],
})
export class RemarksAnalyticsComponent {
  remarksForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.remarksForm = this.fb.group({
      concerns: [''],
      actions: [''],
      recommendations: [''],
    });
  }

  onSubmit() {
    console.log('submit');
  }
}
