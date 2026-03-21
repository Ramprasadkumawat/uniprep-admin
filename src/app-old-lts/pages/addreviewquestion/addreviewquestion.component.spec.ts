import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreviewquestionComponent } from './addreviewquestion.component';

describe('AddreviewquestionComponent', () => {
  let component: AddreviewquestionComponent;
  let fixture: ComponentFixture<AddreviewquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AddreviewquestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddreviewquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
