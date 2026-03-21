import { TestBed } from '@angular/core/testing';

import { WhitelabelService } from './whitelabel.service';

describe('WhitelabelService', () => {
  let service: WhitelabelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhitelabelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
