import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcoupenComponent } from './addcoupen.component';

describe('AddcoupenComponent', () => {
  let component: AddcoupenComponent;
  let fixture: ComponentFixture<AddcoupenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcoupenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcoupenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
