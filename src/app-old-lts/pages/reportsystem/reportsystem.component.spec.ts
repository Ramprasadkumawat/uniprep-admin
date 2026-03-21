import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsystemComponent } from './reportsystem.component';

describe('ReportsystemComponent', () => {
  let component: ReportsystemComponent;
  let fixture: ComponentFixture<ReportsystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
