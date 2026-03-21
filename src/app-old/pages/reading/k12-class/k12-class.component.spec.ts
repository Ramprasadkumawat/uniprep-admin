import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12ClassComponent } from './k12-class.component';

describe('K12ClassComponent', () => {
  let component: K12ClassComponent;
  let fixture: ComponentFixture<K12ClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12ClassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12ClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
