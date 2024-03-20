import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMerhantComponent } from './add-merhant.component';

describe('AddMerhantComponent', () => {
  let component: AddMerhantComponent;
  let fixture: ComponentFixture<AddMerhantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMerhantComponent]
    });
    fixture = TestBed.createComponent(AddMerhantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
