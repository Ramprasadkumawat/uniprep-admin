import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicToolsComponent } from './academic-tools.component';

describe('AcademicToolsComponent', () => {
  let component: AcademicToolsComponent;
  let fixture: ComponentFixture<AcademicToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicToolsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
