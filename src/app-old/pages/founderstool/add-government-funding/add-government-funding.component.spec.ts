import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGovernmentFundingComponent } from './add-government-funding.component';

describe('AddGovernmentFundingComponent', () => {
  let component: AddGovernmentFundingComponent;
  let fixture: ComponentFixture<AddGovernmentFundingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGovernmentFundingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGovernmentFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
