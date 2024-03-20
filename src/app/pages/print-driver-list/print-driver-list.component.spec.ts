import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDriverListComponent } from './print-driver-list.component';

describe('PrintDriverListComponent', () => {
  let component: PrintDriverListComponent;
  let fixture: ComponentFixture<PrintDriverListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintDriverListComponent]
    });
    fixture = TestBed.createComponent(PrintDriverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
