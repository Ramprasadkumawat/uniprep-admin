import { TestBed } from '@angular/core/testing';

import { ReviewdashboadService } from './reviewdashboad.service';

describe('ReviewdashboadService', () => {
  let service: ReviewdashboadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewdashboadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
