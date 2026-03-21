import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubscriptionViewComponent } from './student-subscription-view.component';

describe('StudentSubscriptionViewComponent', () => {
  let component: StudentSubscriptionViewComponent;
  let fixture: ComponentFixture<StudentSubscriptionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ StudentSubscriptionViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSubscriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
