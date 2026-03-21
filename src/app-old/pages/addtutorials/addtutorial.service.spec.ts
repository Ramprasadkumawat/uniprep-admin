import { TestBed } from '@angular/core/testing';

import { AddtutorialService } from './addtutorial.service';

describe('AddtutorialService', () => {
  let service: AddtutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddtutorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
