import { TestBed } from '@angular/core/testing';

import { LanguageHubService } from './language-hub.service';

describe('LanguageHubService', () => {
  let service: LanguageHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
