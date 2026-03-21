import { ComponentFixture, TestBed } from '@angular/core/testing';

import { K12CategoryComponent } from './k12-category.component';

describe('K12CategoryComponent', () => {
  let component: K12CategoryComponent;
  let fixture: ComponentFixture<K12CategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ K12CategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(K12CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
