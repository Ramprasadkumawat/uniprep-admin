import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12Component } from './k12.component';

describe('K12Component', () => {
  let component: K12Component;
  let fixture: ComponentFixture<K12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
