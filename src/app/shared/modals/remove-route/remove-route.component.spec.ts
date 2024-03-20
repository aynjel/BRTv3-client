import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRouteComponent } from './remove-route.component';

describe('RemoveRouteComponent', () => {
  let component: RemoveRouteComponent;
  let fixture: ComponentFixture<RemoveRouteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveRouteComponent]
    });
    fixture = TestBed.createComponent(RemoveRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
