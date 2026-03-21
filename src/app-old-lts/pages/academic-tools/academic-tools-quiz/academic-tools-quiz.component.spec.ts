import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicToolsQuizComponent } from './academic-tools-quiz.component';

describe('AcademicToolsQuizComponent', () => {
  let component: AcademicToolsQuizComponent;
  let fixture: ComponentFixture<AcademicToolsQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicToolsQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicToolsQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
