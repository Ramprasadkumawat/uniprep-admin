import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenuedashboardComponent } from './revenuedashboard.component';

describe('RevenuedashboardComponent', () => {
  let component: RevenuedashboardComponent;
  let fixture: ComponentFixture<RevenuedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RevenuedashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenuedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
