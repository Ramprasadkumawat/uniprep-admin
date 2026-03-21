import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddacademicvedioComponent } from './addacademicvedio.component';

describe('AddacademicvedioComponent', () => {
  let component: AddacademicvedioComponent;
  let fixture: ComponentFixture<AddacademicvedioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddacademicvedioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddacademicvedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
