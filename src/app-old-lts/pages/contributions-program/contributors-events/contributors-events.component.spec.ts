import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsEventsComponent } from './contributors-events.component';

describe('ContributorsEventsComponent', () => {
  let component: ContributorsEventsComponent;
  let fixture: ComponentFixture<ContributorsEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorsEventsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorsEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
