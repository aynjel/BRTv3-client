import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintTransactionLogsComponent } from './print-transaction-logs.component';

describe('PrintTransactionLogsComponent', () => {
  let component: PrintTransactionLogsComponent;
  let fixture: ComponentFixture<PrintTransactionLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintTransactionLogsComponent]
    });
    fixture = TestBed.createComponent(PrintTransactionLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
