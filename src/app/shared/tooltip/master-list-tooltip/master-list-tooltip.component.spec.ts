import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterListTooltipComponent } from './master-list-tooltip.component';

describe('MasterListTooltipComponent', () => {
  let component: MasterListTooltipComponent;
  let fixture: ComponentFixture<MasterListTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterListTooltipComponent]
    });
    fixture = TestBed.createComponent(MasterListTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
