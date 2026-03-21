import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevieworganizationComponent } from './revieworganization.component';

describe('RevieworganizationComponent', () => {
  let component: RevieworganizationComponent;
  let fixture: ComponentFixture<RevieworganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RevieworganizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevieworganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
