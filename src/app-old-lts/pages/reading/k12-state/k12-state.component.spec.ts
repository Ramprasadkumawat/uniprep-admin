import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12StateComponent } from './k12-state.component';

describe('K12StateComponent', () => {
  let component: K12StateComponent;
  let fixture: ComponentFixture<K12StateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12StateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12StateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
