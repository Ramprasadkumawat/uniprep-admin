import { TestBed } from '@angular/core/testing';

import { PitchDeskService } from './pitch-desk.service';

describe('PitchDeskService', () => {
  let service: PitchDeskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PitchDeskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
