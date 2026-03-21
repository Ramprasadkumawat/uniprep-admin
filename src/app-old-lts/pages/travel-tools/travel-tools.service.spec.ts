import { TestBed } from '@angular/core/testing';

import { TravelToolsService } from './travel-tools.service';

describe('TravelToolsService', () => {
  let service: TravelToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
