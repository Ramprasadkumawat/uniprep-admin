import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningHubQuestionsComponent } from './learning-hub-questions.component';

describe('LearningHubQuestionsComponent', () => {
  let component: LearningHubQuestionsComponent;
  let fixture: ComponentFixture<LearningHubQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningHubQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningHubQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
