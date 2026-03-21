import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegemanagementComponent } from './collegemanagement.component';

describe('CollegemanagementComponent', () => {
  let component: CollegemanagementComponent;
  let fixture: ComponentFixture<CollegemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollegemanagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
