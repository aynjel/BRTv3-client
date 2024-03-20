import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintHourlyTransanctionLogsComponent } from './print-hourly-transanction-logs.component';

describe('PrintHourlyTransanctionLogsComponent', () => {
  let component: PrintHourlyTransanctionLogsComponent;
  let fixture: ComponentFixture<PrintHourlyTransanctionLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintHourlyTransanctionLogsComponent]
    });
    fixture = TestBed.createComponent(PrintHourlyTransanctionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
