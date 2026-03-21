import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelGlossaryComponent } from './travel-glossary.component';

describe('TravelGlossaryComponent', () => {
  let component: TravelGlossaryComponent;
  let fixture: ComponentFixture<TravelGlossaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelGlossaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelGlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
