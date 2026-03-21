import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationdataComponent } from './validationdata.component';

describe('ValidationdataComponent', () => {
  let component: ValidationdataComponent;
  let fixture: ComponentFixture<ValidationdataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationdataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
