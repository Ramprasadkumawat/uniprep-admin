import { TestBed } from '@angular/core/testing';

import { ReviewuseradminService } from './reviewuseradmin.service';

describe('ReviewuseradminService', () => {
  let service: ReviewuseradminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewuseradminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
