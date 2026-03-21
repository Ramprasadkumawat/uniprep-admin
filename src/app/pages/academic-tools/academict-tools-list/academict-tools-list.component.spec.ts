import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademictToolsListComponent } from './academict-tools-list.component';

describe('AcademictToolsListComponent', () => {
  let component: AcademictToolsListComponent;
  let fixture: ComponentFixture<AcademictToolsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademictToolsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademictToolsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
