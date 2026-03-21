import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifinderSubjectComponent } from './unifinder-subject.component';

describe('UnifinderSubjectComponent', () => {
  let component: UnifinderSubjectComponent;
  let fixture: ComponentFixture<UnifinderSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnifinderSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnifinderSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
