import { TestBed } from '@angular/core/testing';

import { CountrymanagementService } from './countrymanagement.service';

describe('CountrymanagementService', () => {
  let service: CountrymanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountrymanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
