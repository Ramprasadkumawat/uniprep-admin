import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QareportsComponent } from './qareports.component';

describe('QareportsComponent', () => {
  let component: QareportsComponent;
  let fixture: ComponentFixture<QareportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ QareportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QareportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
