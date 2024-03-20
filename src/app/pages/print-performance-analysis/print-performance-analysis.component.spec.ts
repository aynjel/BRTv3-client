import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPerformanceAnalysisComponent } from './print-performance-analysis.component';

describe('PrintPerformanceAnalysisComponent', () => {
  let component: PrintPerformanceAnalysisComponent;
  let fixture: ComponentFixture<PrintPerformanceAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPerformanceAnalysisComponent]
    });
    fixture = TestBed.createComponent(PrintPerformanceAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
