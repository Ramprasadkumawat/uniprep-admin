import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpartnercoupenComponent } from './addpartnercoupen.component';

describe('AddpartnercoupenComponent', () => {
  let component: AddpartnercoupenComponent;
  let fixture: ComponentFixture<AddpartnercoupenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddpartnercoupenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddpartnercoupenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
