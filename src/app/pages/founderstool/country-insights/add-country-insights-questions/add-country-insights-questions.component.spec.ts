import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountryInsightsQuestionsComponent } from './add-country-insights-questions.component';

describe('AddCountryInsightsQuestionsComponent', () => {
  let component: AddCountryInsightsQuestionsComponent;
  let fixture: ComponentFixture<AddCountryInsightsQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCountryInsightsQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCountryInsightsQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
