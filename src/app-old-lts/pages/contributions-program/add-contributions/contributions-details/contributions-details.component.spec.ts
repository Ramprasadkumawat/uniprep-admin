import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionsDetailsComponent } from './contributions-details.component';

describe('ContributionsDetailsComponent', () => {
  let component: ContributionsDetailsComponent;
  let fixture: ComponentFixture<ContributionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributionsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
