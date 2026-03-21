import { TestBed } from '@angular/core/testing';

import { CareerPlannerService } from './career-planner.service';

describe('CareerPlannerService', () => {
  let service: CareerPlannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareerPlannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
