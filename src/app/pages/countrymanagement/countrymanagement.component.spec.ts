import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrymanagementComponent } from './countrymanagement.component';

describe('CountrymanagementComponent', () => {
  let component: CountrymanagementComponent;
  let fixture: ComponentFixture<CountrymanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountrymanagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountrymanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
