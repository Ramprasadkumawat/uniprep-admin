import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewuserComponent } from './reviewuser.component';

describe('ReviewuserComponent', () => {
  let component: ReviewuserComponent;
  let fixture: ComponentFixture<ReviewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReviewuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
