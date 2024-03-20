import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePersonnelComponent } from './remove-personnel.component';

describe('RemovePersonnelComponent', () => {
  let component: RemovePersonnelComponent;
  let fixture: ComponentFixture<RemovePersonnelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemovePersonnelComponent]
    });
    fixture = TestBed.createComponent(RemovePersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
