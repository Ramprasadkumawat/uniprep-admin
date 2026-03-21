import { TestBed } from '@angular/core/testing';

import { LeaddashboardService } from './leaddashboard.service';

describe('LeaddashboardService', () => {
  let service: LeaddashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaddashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
