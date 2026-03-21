import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageHubQuestionsComponent } from './language-hub-questions.component';

describe('LanguageHubQuestionsComponent', () => {
  let component: LanguageHubQuestionsComponent;
  let fixture: ComponentFixture<LanguageHubQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageHubQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageHubQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
