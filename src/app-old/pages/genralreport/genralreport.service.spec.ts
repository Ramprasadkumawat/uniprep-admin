import { TestBed } from '@angular/core/testing';

import { GenralreportService } from './genralreport.service';

describe('GenralreportService', () => {
  let service: GenralreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenralreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
