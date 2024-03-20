import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonnelComponent } from './edit-personnel.component';

describe('EditPersonnelComponent', () => {
  let component: EditPersonnelComponent;
  let fixture: ComponentFixture<EditPersonnelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPersonnelComponent]
    });
    fixture = TestBed.createComponent(EditPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
