import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveIMEIComponent } from './remove-imei.component';

describe('RemoveIMEIComponent', () => {
  let component: RemoveIMEIComponent;
  let fixture: ComponentFixture<RemoveIMEIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveIMEIComponent]
    });
    fixture = TestBed.createComponent(RemoveIMEIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
