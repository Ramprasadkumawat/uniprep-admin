import { TestBed } from '@angular/core/testing';

import { MycouponService } from './mycoupon.service';

describe('MycouponService', () => {
  let service: MycouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MycouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
