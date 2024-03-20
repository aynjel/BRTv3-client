import { TestBed } from '@angular/core/testing';

import { HistoricalCalendarService } from './historical-calendar.service';

describe('HistoricalCalendarService', () => {
  let service: HistoricalCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricalCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
