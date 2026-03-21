import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCategoryListComponent } from './test-category-list.component';

describe('TestCategoryListComponent', () => {
  let component: TestCategoryListComponent;
  let fixture: ComponentFixture<TestCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCategoryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
