import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewdashboardComponent } from './reviewdashboard.component';

describe('ReviewdashboardComponent', () => {
  let component: ReviewdashboardComponent;
  let fixture: ComponentFixture<ReviewdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReviewdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
