import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchDeskComponent } from './pitch-desk.component';

describe('PitchDeskComponent', () => {
  let component: PitchDeskComponent;
  let fixture: ComponentFixture<PitchDeskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchDeskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchDeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
