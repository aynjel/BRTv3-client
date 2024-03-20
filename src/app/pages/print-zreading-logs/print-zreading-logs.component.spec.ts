import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintZreadingLogsComponent } from './print-zreading-logs.component';

describe('PrintZreadingLogsComponent', () => {
  let component: PrintZreadingLogsComponent;
  let fixture: ComponentFixture<PrintZreadingLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintZreadingLogsComponent]
    });
    fixture = TestBed.createComponent(PrintZreadingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
