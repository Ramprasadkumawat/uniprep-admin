import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcollegeComponent } from './addcollege.component';

describe('AddcollegeComponent', () => {
  let component: AddcollegeComponent;
  let fixture: ComponentFixture<AddcollegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcollegeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
