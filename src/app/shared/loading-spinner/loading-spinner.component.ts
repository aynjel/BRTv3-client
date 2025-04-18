import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

  // Default values
  @Input() statusMessage: string = '';
  @Input() errorMessage: string = 'Server Error';
  @Input() isError: boolean = false;

  ngOnInit(): void {
  }
}
