import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvlComponent } from './pvl.component';

describe('PvlComponent', () => {
  let component: PvlComponent;
  let fixture: ComponentFixture<PvlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PvlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PvlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
