import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedCompaniesComponent } from './applied-companies.component';

describe('AppliedCompaniesComponent', () => {
  let component: AppliedCompaniesComponent;
  let fixture: ComponentFixture<AppliedCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedCompaniesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
