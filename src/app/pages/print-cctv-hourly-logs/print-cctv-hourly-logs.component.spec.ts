import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCctvHourlyLogsComponent } from './print-cctv-hourly-logs.component';

describe('PrintCctvHourlyLogsComponent', () => {
  let component: PrintCctvHourlyLogsComponent;
  let fixture: ComponentFixture<PrintCctvHourlyLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintCctvHourlyLogsComponent]
    });
    fixture = TestBed.createComponent(PrintCctvHourlyLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
