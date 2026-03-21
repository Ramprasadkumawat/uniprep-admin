import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequirementComponent } from './view-requirement.component';

describe('ViewRequirementComponent', () => {
  let component: ViewRequirementComponent;
  let fixture: ComponentFixture<ViewRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRequirementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

