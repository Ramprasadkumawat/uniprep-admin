import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsubmoduleComponent } from './reviewsubmodule.component';

describe('ReviewsubmoduleComponent', () => {
  let component: ReviewsubmoduleComponent;
  let fixture: ComponentFixture<ReviewsubmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReviewsubmoduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsubmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
