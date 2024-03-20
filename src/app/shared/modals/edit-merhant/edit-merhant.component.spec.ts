import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMerhantComponent } from './edit-merhant.component';

describe('EditMerhantComponent', () => {
  let component: EditMerhantComponent;
  let fixture: ComponentFixture<EditMerhantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMerhantComponent]
    });
    fixture = TestBed.createComponent(EditMerhantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
