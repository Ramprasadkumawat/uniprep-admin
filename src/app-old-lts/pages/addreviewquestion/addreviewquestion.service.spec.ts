import { TestBed } from '@angular/core/testing';

import { AddreviewquestionService } from './addreviewquestion.service';

describe('AddreviewquestionService', () => {
  let service: AddreviewquestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddreviewquestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
