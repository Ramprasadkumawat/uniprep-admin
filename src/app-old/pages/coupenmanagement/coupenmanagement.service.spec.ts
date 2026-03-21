import { TestBed } from '@angular/core/testing';

import { CoupenmanagementService } from './coupenmanagement.service';

describe('CoupenmanagementService', () => {
  let service: CoupenmanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoupenmanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
