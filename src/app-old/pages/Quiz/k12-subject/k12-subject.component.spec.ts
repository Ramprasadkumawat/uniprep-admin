import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12SubjectComponent } from './k12-subject.component';

describe('K12SubjectComponent', () => {
  let component: K12SubjectComponent;
  let fixture: ComponentFixture<K12SubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12SubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12SubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
