import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerPlannerComponent } from './career-planner.component';

describe('CareerPlannerComponent', () => {
  let component: CareerPlannerComponent;
  let fixture: ComponentFixture<CareerPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerPlannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
