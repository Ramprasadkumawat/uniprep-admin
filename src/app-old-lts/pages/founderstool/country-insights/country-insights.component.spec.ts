import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryInsightsComponent } from './country-insights.component';

describe('CountryInsightsComponent', () => {
  let component: CountryInsightsComponent;
  let fixture: ComponentFixture<CountryInsightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryInsightsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
