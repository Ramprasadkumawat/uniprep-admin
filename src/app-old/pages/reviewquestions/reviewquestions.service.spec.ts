import { TestBed } from '@angular/core/testing';

import { ReviewquestionsService } from './reviewquestions.service';

describe('ReviewquestionsService', () => {
  let service: ReviewquestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewquestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
