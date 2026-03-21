import { TestBed } from '@angular/core/testing';

import { ReviewsubmoduleService } from './reviewsubmodule.service';

describe('ReviewsubmoduleService', () => {
  let service: ReviewsubmoduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewsubmoduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
