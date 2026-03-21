import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtutorialsComponent } from './addtutorials.component';

describe('AddtutorialsComponent', () => {
  let component: AddtutorialsComponent;
  let fixture: ComponentFixture<AddtutorialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtutorialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
