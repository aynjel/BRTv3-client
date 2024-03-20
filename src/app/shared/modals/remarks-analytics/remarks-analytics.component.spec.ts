import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarksAnalyticsComponent } from './remarks-analytics.component';

describe('RemarksAnalyticsComponent', () => {
  let component: RemarksAnalyticsComponent;
  let fixture: ComponentFixture<RemarksAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemarksAnalyticsComponent]
    });
    fixture = TestBed.createComponent(RemarksAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
