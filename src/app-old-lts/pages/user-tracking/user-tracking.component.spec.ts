import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrackingComponent } from './user-tracking.component';

describe('UserTrackingComponent', () => {
  let component: UserTrackingComponent;
  let fixture: ComponentFixture<UserTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
