/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CareerHubComponent } from './career-hub.component';

describe('CareerHubComponent', () => {
  let component: CareerHubComponent;
  let fixture: ComponentFixture<CareerHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
