import { TestBed } from '@angular/core/testing';

import { RolesmanagementService } from './rolesmanagement.service';

describe('RolesmanagementService', () => {
  let service: RolesmanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesmanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
