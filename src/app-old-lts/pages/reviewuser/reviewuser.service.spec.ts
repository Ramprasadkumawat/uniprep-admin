import { TestBed } from '@angular/core/testing';

import { ReviewuserService } from './reviewuser.service';

describe('ReviewuserService', () => {
  let service: ReviewuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
