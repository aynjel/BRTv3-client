import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPaoListComponent } from './print-pao-list.component';

describe('PrintPaoListComponent', () => {
  let component: PrintPaoListComponent;
  let fixture: ComponentFixture<PrintPaoListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPaoListComponent]
    });
    fixture = TestBed.createComponent(PrintPaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
