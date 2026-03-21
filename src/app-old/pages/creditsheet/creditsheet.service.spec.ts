import { TestBed } from '@angular/core/testing';

import { CreditsheetService } from './creditsheet.service';

describe('CreditsheetService', () => {
  let service: CreditsheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditsheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
