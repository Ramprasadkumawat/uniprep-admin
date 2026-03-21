import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewquestionsComponent } from './reviewquestions.component';

describe('ReviewquestionsComponent', () => {
  let component: ReviewquestionsComponent;
  let fixture: ComponentFixture<ReviewquestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReviewquestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
