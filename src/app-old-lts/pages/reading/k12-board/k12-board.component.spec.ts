import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12BoardComponent } from './k12-board.component';

describe('K12BoardComponent', () => {
  let component: K12BoardComponent;
  let fixture: ComponentFixture<K12BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12BoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
