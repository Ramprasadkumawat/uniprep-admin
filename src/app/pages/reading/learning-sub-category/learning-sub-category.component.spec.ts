import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningSubCategoryComponent } from './learning-sub-category.component';

describe('LearningSubCategoryComponent', () => {
  let component: LearningSubCategoryComponent;
  let fixture: ComponentFixture<LearningSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
