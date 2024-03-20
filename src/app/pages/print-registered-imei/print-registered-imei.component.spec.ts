import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRegisteredImeiComponent } from './print-registered-imei.component';

describe('PrintRegisteredImeiComponent', () => {
  let component: PrintRegisteredImeiComponent;
  let fixture: ComponentFixture<PrintRegisteredImeiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintRegisteredImeiComponent]
    });
    fixture = TestBed.createComponent(PrintRegisteredImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
