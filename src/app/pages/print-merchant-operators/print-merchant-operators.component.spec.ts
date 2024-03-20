import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintMerchantOperatorsComponent } from './print-merchant-operators.component';

describe('PrintMerchantOperatorsComponent', () => {
  let component: PrintMerchantOperatorsComponent;
  let fixture: ComponentFixture<PrintMerchantOperatorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintMerchantOperatorsComponent]
    });
    fixture = TestBed.createComponent(PrintMerchantOperatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
