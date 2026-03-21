import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningHubQuizQuestionsComponent } from './learning-hub.component';

describe('LearningHubComponent', () => {
  let component: LearningHubQuizQuestionsComponent;
  let fixture: ComponentFixture<LearningHubQuizQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningHubQuizQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningHubQuizQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
