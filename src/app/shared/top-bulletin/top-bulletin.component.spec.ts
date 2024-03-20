import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBulletinComponent } from './top-bulletin.component';

describe('TopBulletinComponent', () => {
  let component: TopBulletinComponent;
  let fixture: ComponentFixture<TopBulletinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopBulletinComponent]
    });
    fixture = TestBed.createComponent(TopBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
