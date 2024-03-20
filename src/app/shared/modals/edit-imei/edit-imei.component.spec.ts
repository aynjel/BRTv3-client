import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIMEIComponent } from './edit-imei.component';

describe('EditIMEIComponent', () => {
  let component: EditIMEIComponent;
  let fixture: ComponentFixture<EditIMEIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditIMEIComponent]
    });
    fixture = TestBed.createComponent(EditIMEIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
