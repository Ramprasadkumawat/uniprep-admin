import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeSubscriptionViewComponent } from './college-subscription-view.component';

describe('CollegeSubscriptionViewComponent', () => {
  let component: CollegeSubscriptionViewComponent;
  let fixture: ComponentFixture<CollegeSubscriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CollegeSubscriptionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegeSubscriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
