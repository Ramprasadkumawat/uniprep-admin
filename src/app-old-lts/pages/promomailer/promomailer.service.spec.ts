import { TestBed } from '@angular/core/testing';

import { PromomailerService } from './promomailer.service';

describe('PromomailerService', () => {
  let service: PromomailerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromomailerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
