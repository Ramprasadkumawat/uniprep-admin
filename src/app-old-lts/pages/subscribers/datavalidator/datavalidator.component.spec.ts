import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatavalidatorComponent } from './datavalidator.component';

describe('DatavalidatorComponent', () => {
  let component: DatavalidatorComponent;
  let fixture: ComponentFixture<DatavalidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatavalidatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatavalidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
