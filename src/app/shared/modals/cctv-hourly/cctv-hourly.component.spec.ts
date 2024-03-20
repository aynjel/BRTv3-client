import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CctvHourlyComponent } from './cctv-hourly.component';

describe('CctvHourlyComponent', () => {
  let component: CctvHourlyComponent;
  let fixture: ComponentFixture<CctvHourlyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CctvHourlyComponent]
    });
    fixture = TestBed.createComponent(CctvHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
