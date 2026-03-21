import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppliedProfilesComponent } from './applied-profiles.component';

describe('AppliedProfilesComponent', () => {
  let component: AppliedProfilesComponent;
  let fixture: ComponentFixture<AppliedProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppliedProfilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppliedProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
