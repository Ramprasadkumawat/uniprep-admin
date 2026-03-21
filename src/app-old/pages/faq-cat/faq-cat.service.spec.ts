import { TestBed } from '@angular/core/testing';

import { FaqCatService } from './faq-cat.service';

describe('FaqCatService', () => {
  let service: FaqCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaqCatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
