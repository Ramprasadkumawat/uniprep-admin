import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoliticianInsightsComponent } from './add-politician-insights.component';

describe('AddPoliticianInsightsComponent', () => {
  let component: AddPoliticianInsightsComponent;
  let fixture: ComponentFixture<AddPoliticianInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPoliticianInsightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPoliticianInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
