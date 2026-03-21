import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSitesComponent } from './job-sites.component';

describe('JobSitesComponent', () => {
  let component: JobSitesComponent;
  let fixture: ComponentFixture<JobSitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobSitesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
