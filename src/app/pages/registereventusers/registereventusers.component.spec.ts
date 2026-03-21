import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistereventusersComponent } from './registereventusers.component';

describe('RegistereventusersComponent', () => {
  let component: RegistereventusersComponent;
  let fixture: ComponentFixture<RegistereventusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistereventusersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistereventusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
