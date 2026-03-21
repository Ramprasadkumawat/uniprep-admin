import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSubCategoryListComponent } from './test-sub-category-list.component';

describe('TestSubCategoryListComponent', () => {
  let component: TestSubCategoryListComponent;
  let fixture: ComponentFixture<TestSubCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestSubCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestSubCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
