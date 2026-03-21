import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorpitchtrainingComponent } from './investorpitchtraining.component';

describe('InvestorpitchtrainingComponent', () => {
  let component: InvestorpitchtrainingComponent;
  let fixture: ComponentFixture<InvestorpitchtrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorpitchtrainingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorpitchtrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
