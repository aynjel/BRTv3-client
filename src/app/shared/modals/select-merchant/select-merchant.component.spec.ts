import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMerchantComponent } from './select-merchant.component';

describe('SelectMerchantComponent', () => {
  let component: SelectMerchantComponent;
  let fixture: ComponentFixture<SelectMerchantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMerchantComponent]
    });
    fixture = TestBed.createComponent(SelectMerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
