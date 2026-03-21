/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OurManagementService } from './our-management.service';

describe('Service: OurManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OurManagementService]
    });
  });

  it('should ...', inject([OurManagementService], (service: OurManagementService) => {
    expect(service).toBeTruthy();
  }));
});
