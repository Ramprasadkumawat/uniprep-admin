import { TestBed } from '@angular/core/testing';

import { AddcollegesService } from './addcolleges.service';

describe('AddcollegesService', () => {
  let service: AddcollegesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddcollegesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
