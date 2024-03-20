import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIMEIComponent } from './add-imei.component';

describe('AddIMEIComponent', () => {
  let component: AddIMEIComponent;
  let fixture: ComponentFixture<AddIMEIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIMEIComponent]
    });
    fixture = TestBed.createComponent(AddIMEIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
