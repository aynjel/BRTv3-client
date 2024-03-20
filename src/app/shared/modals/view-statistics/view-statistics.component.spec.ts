import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatisticsComponent } from './view-statistics.component';

describe('ViewStatisticsComponent', () => {
  let component: ViewStatisticsComponent;
  let fixture: ComponentFixture<ViewStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewStatisticsComponent]
    });
    fixture = TestBed.createComponent(ViewStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
