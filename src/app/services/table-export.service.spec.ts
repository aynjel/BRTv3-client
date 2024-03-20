import { TestBed } from '@angular/core/testing';

import { TableExportService } from './table-export.service';

describe('TableExportService', () => {
  let service: TableExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
