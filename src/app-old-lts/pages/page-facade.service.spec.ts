import { TestBed } from '@angular/core/testing';

import { PageFacadeService } from './page-facade.service';

describe('PageFacadeService', () => {
  let service: PageFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
