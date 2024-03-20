import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImeiAnalyticsDetailsComponent } from './imei-analytics-details.component';

describe('ImeiAnalyticsDetailsComponent', () => {
  let component: ImeiAnalyticsDetailsComponent;
  let fixture: ComponentFixture<ImeiAnalyticsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImeiAnalyticsDetailsComponent]
    });
    fixture = TestBed.createComponent(ImeiAnalyticsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
