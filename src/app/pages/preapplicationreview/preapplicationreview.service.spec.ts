import { TestBed } from '@angular/core/testing';

import { PreapplicationreviewService } from './preapplicationreview.service';

describe('PreapplicationreviewService', () => {
  let service: PreapplicationreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreapplicationreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
