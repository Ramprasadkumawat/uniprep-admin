import { TestBed } from '@angular/core/testing';

import { FounderstoolService } from './founderstool.service';

describe('FounderstoolService', () => {
  let service: FounderstoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FounderstoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
