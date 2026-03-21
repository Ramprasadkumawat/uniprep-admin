import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeAtCountryComponent } from './life-at-country.component';

describe('LifeAtCountryComponent', () => {
  let component: LifeAtCountryComponent;
  let fixture: ComponentFixture<LifeAtCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeAtCountryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifeAtCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
