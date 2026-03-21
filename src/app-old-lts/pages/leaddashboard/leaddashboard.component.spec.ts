import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaddashboardComponent } from './leaddashboard.component';

describe('LeaddashboardComponent', () => {
  let component: LeaddashboardComponent;
  let fixture: ComponentFixture<LeaddashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaddashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaddashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
