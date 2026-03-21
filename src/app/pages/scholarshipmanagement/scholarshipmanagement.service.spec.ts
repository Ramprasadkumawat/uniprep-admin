import { TestBed } from '@angular/core/testing';

import { ScholarshipmanagementService } from './scholarshipmanagement.service';

describe('ScholarshipmanagementService', () => {
  let service: ScholarshipmanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScholarshipmanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
