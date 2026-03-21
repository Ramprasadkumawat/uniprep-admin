import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipmanagementComponent } from './scholarshipmanagement.component';

describe('ScholarshipmanagementComponent', () => {
  let component: ScholarshipmanagementComponent;
  let fixture: ComponentFixture<ScholarshipmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScholarshipmanagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarshipmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
