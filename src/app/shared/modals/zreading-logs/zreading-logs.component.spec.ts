import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZreadingLogsComponent } from './zreading-logs.component';

describe('ZreadingLogsComponent', () => {
  let component: ZreadingLogsComponent;
  let fixture: ComponentFixture<ZreadingLogsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZreadingLogsComponent]
    });
    fixture = TestBed.createComponent(ZreadingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
