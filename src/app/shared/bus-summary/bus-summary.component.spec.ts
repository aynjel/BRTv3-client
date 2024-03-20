import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusSummaryComponent } from './bus-summary.component';

describe('BusSummaryComponent', () => {
  let component: BusSummaryComponent;
  let fixture: ComponentFixture<BusSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusSummaryComponent]
    });
    fixture = TestBed.createComponent(BusSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
