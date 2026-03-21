import { TestBed } from '@angular/core/testing';

import { StudentlistService } from './studentlist.service';

describe('StudentlistService', () => {
  let service: StudentlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
