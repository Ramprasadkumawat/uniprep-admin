import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionfeedbackformComponent } from './sessionfeedbackform.component';

describe('SessionfeedbackformComponent', () => {
  let component: SessionfeedbackformComponent;
  let fixture: ComponentFixture<SessionfeedbackformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionfeedbackformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionfeedbackformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
