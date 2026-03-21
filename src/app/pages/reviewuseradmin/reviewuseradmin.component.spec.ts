import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewuseradminComponent } from './reviewuseradmin.component';

describe('ReviewuseradminComponent', () => {
  let component: ReviewuseradminComponent;
  let fixture: ComponentFixture<ReviewuseradminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReviewuseradminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewuseradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
