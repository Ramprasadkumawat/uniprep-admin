import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenralreportComponent } from './genralreport.component';

describe('GenralreportComponent', () => {
  let component: GenralreportComponent;
  let fixture: ComponentFixture<GenralreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenralreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenralreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
