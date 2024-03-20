import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelapseComponent } from './timelapse.component';

describe('TimelapseComponent', () => {
  let component: TimelapseComponent;
  let fixture: ComponentFixture<TimelapseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimelapseComponent]
    });
    fixture = TestBed.createComponent(TimelapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
