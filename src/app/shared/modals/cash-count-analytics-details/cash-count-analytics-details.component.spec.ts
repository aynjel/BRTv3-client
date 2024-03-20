import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCountAnalyticsDetailsComponent } from './cash-count-analytics-details.component';

describe('CashCountAnalyticsDetailsComponent', () => {
  let component: CashCountAnalyticsDetailsComponent;
  let fixture: ComponentFixture<CashCountAnalyticsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashCountAnalyticsDetailsComponent]
    });
    fixture = TestBed.createComponent(CashCountAnalyticsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
