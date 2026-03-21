import { TestBed } from '@angular/core/testing';

import { QareportsService } from './qareports.service';

describe('QareportsService', () => {
  let service: QareportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QareportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
