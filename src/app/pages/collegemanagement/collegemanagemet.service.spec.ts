import { TestBed } from '@angular/core/testing';

import { CollegemanagemetService } from './collegemanagemet.service';

describe('CollegemanagemetService', () => {
  let service: CollegemanagemetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegemanagemetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
