/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LifeAtComponent } from './life-at.component';

describe('LifeAtComponent', () => {
  let component: LifeAtComponent;
  let fixture: ComponentFixture<LifeAtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeAtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeAtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
