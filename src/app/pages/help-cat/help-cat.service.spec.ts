import { TestBed } from '@angular/core/testing';

import { HelpCatService } from './help-cat.service';

describe('HelpCatService', () => {
  let service: HelpCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpCatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
