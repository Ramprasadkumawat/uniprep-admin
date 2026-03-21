import { TestBed } from '@angular/core/testing';

import { RegistereventusersService } from './registereventusers.service';

describe('RegistereventusersService', () => {
  let service: RegistereventusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistereventusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
