import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerHubComponent } from './career-hub.component';

describe('CareerHubComponent', () => {
  let component: CareerHubComponent;
  let fixture: ComponentFixture<CareerHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareerHubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
