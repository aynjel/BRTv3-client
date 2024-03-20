import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailsComponent } from './route-details.component';

describe('RouteDetailsComponent', () => {
  let component: RouteDetailsComponent;
  let fixture: ComponentFixture<RouteDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteDetailsComponent]
    });
    fixture = TestBed.createComponent(RouteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
