import { TestBed } from '@angular/core/testing';

import { QAndAsummaryService } from './q-and-asummary.service';

describe('QAndAsummaryService', () => {
  let service: QAndAsummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QAndAsummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
