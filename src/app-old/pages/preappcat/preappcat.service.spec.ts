import { TestBed } from '@angular/core/testing';

import { PreappcatService } from './preappcat.service';

describe('PreappcatService', () => {
  let service: PreappcatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreappcatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
