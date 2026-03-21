import { TestBed } from '@angular/core/testing';

import { MarketingorgService } from './marketingorg.service';

describe('MarketingorgService', () => {
  let service: MarketingorgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketingorgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
