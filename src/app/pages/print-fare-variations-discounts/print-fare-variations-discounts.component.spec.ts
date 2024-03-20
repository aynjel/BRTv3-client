import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFareVariationsDiscountsComponent } from './print-fare-variations-discounts.component';

describe('PrintFareVariationsDiscountsComponent', () => {
  let component: PrintFareVariationsDiscountsComponent;
  let fixture: ComponentFixture<PrintFareVariationsDiscountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintFareVariationsDiscountsComponent]
    });
    fixture = TestBed.createComponent(PrintFareVariationsDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
