import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicToolsCategoryComponent } from './academic-tools-category.component';

describe('AcademicToolsCategoryComponent', () => {
  let component: AcademicToolsCategoryComponent;
  let fixture: ComponentFixture<AcademicToolsCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicToolsCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicToolsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
