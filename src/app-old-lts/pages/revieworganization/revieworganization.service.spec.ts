import { TestBed } from '@angular/core/testing';

import { RevieworganizationService } from './revieworganization.service';

describe('RevieworganizationService', () => {
  let service: RevieworganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevieworganizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
